package soqe.pensa.api.item;

import lombok.Builder;
import java.time.Instant;

@Builder
public record ItemResponse(
    String handle,
    String slug,
    String title,
    String description,
    String position,
    boolean isCompleted,
    String projectId,
    String sectionId,
    String parentItemId,
    Instant startAt,
    Instant dueAt,
    Instant createdAt,
    Instant updatedAt
) {}
