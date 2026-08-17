package soqe.pensa.api.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;
import java.util.UUID;

import soqe.pensa.api.user.User;
import soqe.pensa.api.user.UserRepository;
import org.springframework.context.annotation.Lazy;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
public class JpaAuditConfig {

    @Bean
    public AuditorAware<UUID> springSecurityAuditorAware(@Lazy UserRepository userRepository) {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getPrincipal)
                .filter(principal -> principal instanceof Jwt)
                .flatMap(principal -> {
                    String clerkId = ((Jwt) principal).getSubject();
                    if (clerkId == null) return Optional.empty();
                    return userRepository.findByClerkId(clerkId).map(User::getId);
                });
    }
}
