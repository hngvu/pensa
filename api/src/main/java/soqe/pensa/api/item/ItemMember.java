package soqe.pensa.api.item;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import soqe.pensa.api.common.AuditableEntity;

import java.util.UUID;

@Entity
@Table(
    name = "item_members",
    uniqueConstraints = @UniqueConstraint(columnNames = {"item_id", "user_id"})
)
@Getter
@Setter
public class ItemMember extends AuditableEntity {

    @Column(name = "item_id", nullable = false)
    private UUID itemId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;
}
