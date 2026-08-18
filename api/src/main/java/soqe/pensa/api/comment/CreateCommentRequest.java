package soqe.pensa.api.comment;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record CreateCommentRequest(
    @NotBlank(message = "Content is required") String content,
    UUID parentCommentId
) {}
