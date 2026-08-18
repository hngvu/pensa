package soqe.pensa.api.workspace;

import org.springframework.data.jpa.domain.Specification;

public class WorkspaceSpecification {

    public static Specification<Workspace> withName(String name) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Workspace> withVisibility(WorkspaceVisibility visibility) {
        return (root, query, cb) -> cb.equal(root.get("visibility"), visibility);
    }
}
