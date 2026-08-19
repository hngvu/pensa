package soqe.pensa.api.workspace;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Subquery;
import jakarta.persistence.criteria.Root;
import java.util.UUID;

public class WorkspaceSpecification {

    public static Specification<Workspace> withName(String name) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Workspace> withVisibility(WorkspaceVisibility visibility) {
        return (root, query, cb) -> cb.equal(root.get("visibility"), visibility);
    }

    public static Specification<Workspace> withMember(UUID userId) {
        return (root, query, cb) -> {
            Subquery<UUID> subquery = query.subquery(UUID.class);
            Root<WorkspaceMember> memberRoot = subquery.from(WorkspaceMember.class);
            subquery.select(memberRoot.get("workspaceId"))
                    .where(cb.equal(memberRoot.get("userId"), userId));
            return cb.in(root.get("id")).value(subquery);
        };
    }
}
