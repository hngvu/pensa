package soqe.pensa.api.comments;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import soqe.pensa.api.common.AuditableEntity;

import java.util.UUID;

@Entity
@Table(
    name = "reactions",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "target_type", "target_id", "emoji"})
)
@Getter
@Setter
public class Reaction extends AuditableEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private ReactionTargetType targetType;

    @Column(name = "target_id", nullable = false)
    private UUID targetId;

    @Column(name = "emoji", nullable = false)
    private String emoji;
}
