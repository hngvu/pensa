package soqe.pensa.api.label;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "item_labels")
@IdClass(ItemLabelId.class)
@Getter
@Setter
public class ItemLabel {

    @Id
    @Column(name = "item_id", nullable = false)
    private UUID itemId;

    @Id
    @Column(name = "label_id", nullable = false)
    private UUID labelId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
