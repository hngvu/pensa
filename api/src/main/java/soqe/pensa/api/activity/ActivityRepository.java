package soqe.pensa.api.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findAllByWorkspaceIdOrderByCreatedAtDesc(UUID workspaceId);
    List<ActivityLog> findAllByProjectIdOrderByCreatedAtDesc(UUID projectId);
    List<ActivityLog> findAllByEntityIdOrderByCreatedAtDesc(UUID entityId);
}
