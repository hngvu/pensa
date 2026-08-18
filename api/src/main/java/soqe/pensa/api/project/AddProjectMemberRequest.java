package soqe.pensa.api.project;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AddProjectMemberRequest(
    @NotNull(message = "User ID is required") UUID userId,
    @NotNull(message = "Role is required") ProjectRole role
) {}
