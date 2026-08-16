package soqe.pensa.api.workspace;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import soqe.pensa.api.common.SoftDeletableEntity;
import soqe.pensa.api.subscription.WorkspacePlan;
import soqe.pensa.api.subscription.SubscriptionStatus;

import java.util.UUID;

@Entity
@Table(name = "workspaces")
@Getter
@Setter
@SQLDelete(sql = "UPDATE workspaces SET deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted_at IS NULL")
public class Workspace extends SoftDeletableEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "handle", nullable = false, unique = true)
    private String handle;

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private WorkspaceVisibility visibility = WorkspaceVisibility.PRIVATE;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan", nullable = false)
    private WorkspacePlan plan = WorkspacePlan.FREE;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_status", nullable = false)
    private SubscriptionStatus subscriptionStatus = SubscriptionStatus.ACTIVE;

    @Column(name = "settings", columnDefinition = "jsonb")
    private String settings;
}
