package soqe.pensa.api.project;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record CreateProjectRequest(
    @NotBlank(message = "Project name is required") String name,
    String iconUrl,
    UUID leadId
) {}
