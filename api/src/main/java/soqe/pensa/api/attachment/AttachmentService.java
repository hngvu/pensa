package soqe.pensa.api.attachment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import soqe.pensa.api.common.CurrentUserProvider;
import soqe.pensa.api.exception.BusinessException;
import soqe.pensa.api.exception.ResourceNotFoundException;
import soqe.pensa.api.item.ItemService;
import soqe.pensa.api.user.User;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final S3StorageService s3StorageService;
    private final ItemService itemService;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public AttachmentResponse uploadAttachment(String itemHandle, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException("Cannot upload empty file");
        }

        UUID itemId = itemService.getItemId(itemHandle);
        User currentUser = currentUserProvider.getCurrentUser();

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "unknown";
        }
        
        // Generate a unique storage path: items/{itemId}/{uuid}-{filename}
        String storagePath = "items/" + itemId.toString() + "/" + UUID.randomUUID() + "-" + originalFilename;

        // Upload to S3
        s3StorageService.uploadFile(storagePath, file);

        Attachment attachment = new Attachment();
        attachment.setItemId(itemId);
        attachment.setUploaderId(currentUser.getId());
        attachment.setFileName(originalFilename);
        attachment.setFileSize(file.getSize());
        attachment.setContentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        attachment.setStoragePath(storagePath);

        attachment = attachmentRepository.save(attachment);

        return mapToResponse(attachment);
    }

    @Transactional(readOnly = true)
    public List<AttachmentResponse> getAttachments(String itemHandle) {
        UUID itemId = itemService.getItemId(itemHandle);

        return attachmentRepository.findAllByItemIdOrderByCreatedAtDesc(itemId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAttachment(UUID id) {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

        User currentUser = currentUserProvider.getCurrentUser();
        if (!attachment.getUploaderId().equals(currentUser.getId())) {
            throw new BusinessException("You can only delete your own attachments");
        }

        // Delete from S3
        s3StorageService.deleteFile(attachment.getStoragePath());

        // Soft delete from DB
        attachmentRepository.delete(attachment);
    }

    private AttachmentResponse mapToResponse(Attachment attachment) {
        String presignedUrl = s3StorageService.generatePresignedUrl(attachment.getStoragePath());
        
        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileSize(attachment.getFileSize())
                .contentType(attachment.getContentType())
                .url(presignedUrl)
                .itemId(attachment.getItemId().toString())
                .uploaderId(attachment.getUploaderId().toString())
                .createdAt(attachment.getCreatedAt())
                .updatedAt(attachment.getUpdatedAt())
                .build();
    }
}
