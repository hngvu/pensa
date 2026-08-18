package soqe.pensa.api.label;

import lombok.Builder;
import java.time.Instant;
import java.util.UUID;

@Builder
public record LabelResponse(
    UUID id,
    String name,
    String backgroundColor,
    String textColor,
    String projectId,
    Instant createdAt,
    Instant updatedAt
) {}
