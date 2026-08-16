package soqe.pensa.api.comment;

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
@Table(name = "comments")
@Getter
@Setter
@SQLDelete(sql = "UPDATE comments SET deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted_at IS NULL")
public class Comment extends SoftDeletableEntity {

    @Column(name = "item_id", nullable = false)
    private UUID itemId;

    @Column(name = "author_id", nullable = false)
    private UUID authorId;

    @Column(name = "parent_comment_id")
    private UUID parentCommentId;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "is_edited", nullable = false)
    private boolean isEdited = false;
}
