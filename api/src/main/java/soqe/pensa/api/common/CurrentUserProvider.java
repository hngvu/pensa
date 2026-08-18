package soqe.pensa.api.common;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import soqe.pensa.api.exception.BusinessException;
import soqe.pensa.api.user.User;
import soqe.pensa.api.user.UserRepository;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            String clerkId = jwt.getSubject();
            return userRepository.findByClerkId(clerkId)
                    .orElseThrow(() -> new BusinessException("User not synced with database"));
        }
        throw new BusinessException("User is not authenticated");
    }

    public UUID getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
