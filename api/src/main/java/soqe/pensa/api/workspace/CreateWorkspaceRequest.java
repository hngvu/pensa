package soqe.pensa.api.workspace;

import jakarta.validation.constraints.NotBlank;

public record CreateWorkspaceRequest(
    @NotBlank(message = "Workspace name is required") String name,
    String avatarUrl,
    WorkspaceVisibility visibility,
    String settings
) {
    public CreateWorkspaceRequest {
        if (visibility == null) visibility = WorkspaceVisibility.PRIVATE;
    }
}
