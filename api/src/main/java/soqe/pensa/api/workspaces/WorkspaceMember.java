package soqe.pensa.api.workspaces;

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
    name = "workspace_members",
    uniqueConstraints = @UniqueConstraint(columnNames = {"workspace_id", "user_id"})
)
@Getter
@Setter
public class WorkspaceMember extends AuditableEntity {

    @Column(name = "workspace_id", nullable = false)
    private UUID workspaceId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private WorkspaceRole role;
}
