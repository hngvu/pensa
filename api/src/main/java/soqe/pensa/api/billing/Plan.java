package soqe.pensa.api.billing;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import soqe.pensa.api.common.SoftDeletableEntity;

@Entity
@Table(name = "plans")
@Getter
@Setter
@SQLDelete(sql = "UPDATE plans SET deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted_at IS NULL")
public class Plan extends SoftDeletableEntity {

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "price", nullable = false)
    private Long price;

    @Column(name = "currency", nullable = false)
    private String currency = "USD";

    @Column(name = "max_members")
    private Integer maxMembers;

    @Column(name = "max_projects")
    private Integer maxProjects;

    @Column(name = "max_storage_mb")
    private Long maxStorageMb;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}
