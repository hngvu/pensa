package soqe.pensa.api.project;

import lombok.Builder;
import soqe.pensa.api.user.UserResponse;
import java.time.Instant;

@Builder
public record ProjectMemberResponse(
    String projectHandle,
    UserResponse user,
    ProjectRole role,
    Instant joinedAt
) {}
