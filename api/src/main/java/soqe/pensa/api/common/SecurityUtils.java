package soqe.pensa.api.common;

import org.springframework.security.oauth2.jwt.Jwt;
import java.util.UUID;

public final class SecurityUtils {

    private SecurityUtils() {
        // Prevent instantiation
    }

    public static UUID extractUserId(Jwt jwt) {
        if (jwt == null || jwt.getSubject() == null) {
            throw new IllegalArgumentException("Unauthorized: Invalid JWT token");
        }
        try {
            return UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unauthorized: Invalid subject format");
        }
    }
}
