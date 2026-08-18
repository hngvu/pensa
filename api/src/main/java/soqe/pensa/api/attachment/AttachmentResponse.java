package soqe.pensa.api.attachment;

import lombok.Builder;
import java.time.Instant;
import java.util.UUID;

@Builder
public record AttachmentResponse(
    UUID id,
    String fileName,
    Long fileSize,
    String contentType,
    String url,
    String itemId,
    String uploaderId,
    Instant createdAt,
    Instant updatedAt
) {}
