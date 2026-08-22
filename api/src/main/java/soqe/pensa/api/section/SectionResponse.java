package soqe.pensa.api.section;

import lombok.Builder;
import java.time.Instant;

@Builder
public record SectionResponse(
    String id,
    String handle,
    String name,
    String slug,
    String position,
    String projectId,
    Instant createdAt,
    Instant updatedAt
) {}
