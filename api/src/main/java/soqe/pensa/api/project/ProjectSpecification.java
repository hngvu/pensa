package soqe.pensa.api.project;

import org.springframework.data.jpa.domain.Specification;
import java.util.UUID;

public class ProjectSpecification {

    public static Specification<Project> withWorkspaceId(UUID workspaceId) {
        return (root, query, cb) -> cb.equal(root.get("workspaceId"), workspaceId);
    }

    public static Specification<Project> withName(String name) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }
}
