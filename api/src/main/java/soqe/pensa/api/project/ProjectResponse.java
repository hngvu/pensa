package soqe.pensa.api.project;

import lombok.Builder;
import java.time.Instant;

@Builder
public record ProjectResponse(
    String handle,
    String name,
    String slug,
    String iconUrl,
    String workspaceId,
    String leadId,
    Integer issueCounter,
    Instant createdAt,
    Instant updatedAt
) {}
