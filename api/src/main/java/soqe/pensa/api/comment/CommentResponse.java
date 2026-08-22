package soqe.pensa.api.comment;

import lombok.Builder;
import java.time.Instant;
import java.util.UUID;

@Builder
public record CommentResponse(
    UUID id,
    String content,
    boolean isEdited,
    String itemId,
    String authorId,
    String authorName,
    String authorAvatarUrl,
    String parentCommentId,
    Instant createdAt,
    Instant updatedAt
) {}
