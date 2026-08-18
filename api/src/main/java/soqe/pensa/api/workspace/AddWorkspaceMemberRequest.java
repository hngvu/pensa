package soqe.pensa.api.workspace;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AddWorkspaceMemberRequest(
    @NotNull(message = "User ID is required") UUID userId,
    @NotNull(message = "Role is required") WorkspaceRole role
) {}
