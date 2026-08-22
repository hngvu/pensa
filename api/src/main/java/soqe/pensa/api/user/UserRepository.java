package soqe.pensa.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    @org.springframework.data.jpa.repository.QueryHints(@jakarta.persistence.QueryHint(name = "org.hibernate.flushMode", value = "COMMIT"))
    Optional<User> findByClerkId(String clerkId);
}
