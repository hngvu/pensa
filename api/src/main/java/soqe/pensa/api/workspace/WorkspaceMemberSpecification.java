package soqe.pensa.api.workspace;

import org.springframework.data.jpa.domain.Specification;
import java.util.UUID;

public class WorkspaceMemberSpecification {

    public static Specification<WorkspaceMember> withWorkspaceId(UUID workspaceId) {
        return (root, query, cb) -> cb.equal(root.get("workspaceId"), workspaceId);
    }

    public static Specification<WorkspaceMember> withRole(WorkspaceRole role) {
        return (root, query, cb) -> cb.equal(root.get("role"), role);
    }
}
