package soqe.pensa.api.workspace;

import lombok.Builder;
import java.time.Instant;

@Builder
public record WorkspaceResponse(
    String handle,
    String name,
    String slug,
    String avatarUrl,
    String ownerId,
    WorkspaceVisibility visibility,
    String settings,
    Instant createdAt,
    Instant updatedAt
) {
}
