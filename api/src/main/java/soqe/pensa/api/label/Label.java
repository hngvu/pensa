package soqe.pensa.api.label;

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
    name = "labels",
    uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "name"})
)
@Getter
@Setter
public class Label extends AuditableEntity {

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "color")
    private String color;
}
