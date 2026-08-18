package soqe.pensa.api.workspace;

import soqe.pensa.api.user.UserResponse;
import lombok.Builder;
import java.time.Instant;

@Builder
public record WorkspaceMemberResponse(
    String workspaceHandle,
    UserResponse user,
    WorkspaceRole role,
    Instant joinedAt
) {
}
