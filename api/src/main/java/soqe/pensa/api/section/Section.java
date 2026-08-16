package soqe.pensa.api.section;

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
@Table(name = "sections")
@Getter
@Setter
@SQLDelete(sql = "UPDATE sections SET deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted_at IS NULL")
public class Section extends SoftDeletableEntity {

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "handle", nullable = false, unique = true)
    private String handle;

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "position", nullable = false)
    private String position;
}