package soqe.pensa.api.attachment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping("/items/{itemHandle}/attachments")
    public List<AttachmentResponse> getAttachments(@PathVariable String itemHandle) {
        return attachmentService.getAttachments(itemHandle);
    }

    @PostMapping(value = "/items/{itemHandle}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public AttachmentResponse uploadAttachment(
            @PathVariable String itemHandle,
            @RequestPart("file") MultipartFile file) {
        return attachmentService.uploadAttachment(itemHandle, file);
    }

    @DeleteMapping("/attachments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAttachment(@PathVariable UUID id) {
        attachmentService.deleteAttachment(id);
    }
}
