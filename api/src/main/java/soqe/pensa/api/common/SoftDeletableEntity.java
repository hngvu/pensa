package soqe.pensa.api.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@MappedSuperclass
@Getter
@Setter
public abstract class SoftDeletableEntity extends AuditableEntity {

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Column(name = "deleted_by")
    private UUID deletedBy;

    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    public void markDeleted(UUID userId) {
        this.deletedAt = Instant.now();
        this.deletedBy = userId;
    }

    public void restore() {
        this.deletedAt = null;
        this.deletedBy = null;
    }
}
