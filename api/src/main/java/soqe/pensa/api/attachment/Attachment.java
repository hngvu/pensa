package soqe.pensa.api.attachment;

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
@Table(name = "attachments")
@Getter
@Setter
@SQLDelete(sql = "UPDATE attachments SET deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted_at IS NULL")
public class Attachment extends SoftDeletableEntity {

    @Column(name = "item_id", nullable = false)
    private UUID itemId;

    @Column(name = "uploader_id", nullable = false)
    private UUID uploaderId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "content_type", nullable = false)
    private String contentType;

    @Column(name = "storage_path", nullable = false)
    private String storagePath;

    @Column(name = "checksum")
    private String checksum;
}
