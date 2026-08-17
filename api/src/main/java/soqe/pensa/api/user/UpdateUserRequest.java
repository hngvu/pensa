package soqe.pensa.api.user;

import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
    String username,

    String fullName,
    
    String avatarUrl
) {}
