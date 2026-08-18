package soqe.pensa.api.project;

import jakarta.validation.constraints.NotNull;

public record UpdateProjectMemberRequest(
    @NotNull(message = "Role is required") ProjectRole role
) {}
