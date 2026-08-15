package soqe.pensa.api.items;

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
@Table(name = "items")
@Getter
@Setter
@SQLDelete(sql = "UPDATE items SET deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted_at IS NULL")
public class Item extends SoftDeletableEntity {

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "section_id", nullable = false)
    private UUID sectionId;

    @Column(name = "parent_item_id")
    private UUID parentItemId;

    @Column(name = "is_completed", nullable = false)
    private boolean isCompleted = false;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "position", nullable = false)
    private String position;
}
