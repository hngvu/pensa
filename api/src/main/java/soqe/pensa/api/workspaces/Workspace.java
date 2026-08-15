package soqe.pensa.api.workspaces;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import soqe.pensa.api.common.SoftDeletableEntity;

import java.util.UUID;

@Entity
@Table(name = "workspaces")
@Getter
@Setter
@SQLDelete(sql = "UPDATE workspaces SET deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted_at IS NULL")
public class Workspace extends SoftDeletableEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "description")
    private String description;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(name = "plan_type")
    private String planType;
}
