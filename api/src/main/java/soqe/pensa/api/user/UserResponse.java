package soqe.pensa.api.user;

import lombok.Builder;
import java.time.Instant;

@Builder
public record UserResponse(
    String email,
    String username,
    String fullName,
    String avatarUrl,
    boolean isActive,
    Instant createdAt,
    Instant updatedAt
) {
    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
