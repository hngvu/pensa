package soqe.pensa.api.project;

import java.util.UUID;

public record UpdateProjectRequest(
    String name,
    String description
) {}
