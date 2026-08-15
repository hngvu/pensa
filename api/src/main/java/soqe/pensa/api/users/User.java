package soqe.pensa.api.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import soqe.pensa.api.common.SoftDeletableEntity;

@Entity
@Table(name = "users")
@Getter
@Setter
@SQLDelete(sql = "UPDATE users SET deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted_at IS NULL")
public class User extends SoftDeletableEntity {

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}
