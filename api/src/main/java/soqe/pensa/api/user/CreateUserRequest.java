package soqe.pensa.api.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
    @NotBlank @Email
    String email,

    @NotBlank @Size(max = 50)
    String username,

    @Size(max = 100)
    String fullName,

    String avatarUrl
) {}
