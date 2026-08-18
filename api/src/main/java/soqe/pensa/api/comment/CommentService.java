package soqe.pensa.api.comment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final ItemService itemService;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public CommentResponse createComment(String itemHandle, CreateCommentRequest request) {
        UUID itemId = itemService.getItemId(itemHandle);
        User currentUser = currentUserProvider.getCurrentUser();

        Comment comment = new Comment();
        comment.setItemId(itemId);
        comment.setAuthorId(currentUser.getId());
        comment.setContent(request.content());
        comment.setParentCommentId(request.parentCommentId());
        comment.setEdited(false);

        comment = commentRepository.save(comment);

        return mapToResponse(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByItem(String itemHandle) {
        UUID itemId = itemService.getItemId(itemHandle);

        return commentRepository.findAllByItemIdOrderByCreatedAtAsc(itemId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse updateComment(UUID id, UpdateCommentRequest request) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        User currentUser = currentUserProvider.getCurrentUser();
        if (!comment.getAuthorId().equals(currentUser.getId())) {
            throw new BusinessException("You can only edit your own comments");
        }

        comment.setContent(request.content());
        comment.setEdited(true);

        comment = commentRepository.save(comment);
        return mapToResponse(comment);
    }

    @Transactional
    public void deleteComment(UUID id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
                
        User currentUser = currentUserProvider.getCurrentUser();
        if (!comment.getAuthorId().equals(currentUser.getId())) {
            throw new BusinessException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .isEdited(comment.isEdited())
                .itemId(comment.getItemId().toString())
                .authorId(comment.getAuthorId().toString())
                .parentCommentId(comment.getParentCommentId() != null ? comment.getParentCommentId().toString() : null)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
