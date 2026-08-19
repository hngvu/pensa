package soqe.pensa.api.user;

public record SyncUserRequest(
        String email,
        String fullName,
        String avatarUrl
) {
}