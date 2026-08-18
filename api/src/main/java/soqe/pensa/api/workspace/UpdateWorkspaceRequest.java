package soqe.pensa.api.workspace;

public record UpdateWorkspaceRequest(
    String name,
    String avatarUrl,
    WorkspaceVisibility visibility,
    String settings
) {}
