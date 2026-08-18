package soqe.pensa.api.workspace;

import jakarta.validation.constraints.NotNull;

public record UpdateWorkspaceMemberRequest(
    @NotNull(message = "Role is required") WorkspaceRole role
) {}
