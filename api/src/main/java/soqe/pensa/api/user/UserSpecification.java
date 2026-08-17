package soqe.pensa.api.user;

import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;
import soqe.pensa.api.project.Project;
import soqe.pensa.api.project.ProjectMember;
import soqe.pensa.api.workspace.Workspace;
import soqe.pensa.api.workspace.WorkspaceMember;

import java.util.UUID;

public class UserSpecification {

    public static Specification<User> withEmail(String email) {
        return (root, query, cb) -> email == null ? null : cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%");
    }

    public static Specification<User> withUsername(String username) {
        return (root, query, cb) -> username == null ? null : cb.like(cb.lower(root.get("username")), "%" + username.toLowerCase() + "%");
    }

    public static Specification<User> withFullName(String fullName) {
        return (root, query, cb) -> fullName == null ? null : cb.like(cb.lower(root.get("fullName")), "%" + fullName.toLowerCase() + "%");
    }

    public static Specification<User> isActive(Boolean isActive) {
        return (root, query, cb) -> isActive == null ? null : cb.equal(root.get("isActive"), isActive);
    }

    public static Specification<User> inWorkspace(String workspaceHandle) {
        return (root, query, cb) -> {
            if (workspaceHandle == null) return null;
            Subquery<UUID> subquery = query.subquery(UUID.class);
            Root<WorkspaceMember> memberRoot = subquery.from(WorkspaceMember.class);
            Root<Workspace> workspaceRoot = subquery.from(Workspace.class);
            
            subquery.select(memberRoot.get("userId"))
                    .where(cb.and(
                        cb.equal(memberRoot.get("workspaceId"), workspaceRoot.get("id")),
                        cb.equal(workspaceRoot.get("handle"), workspaceHandle)
                    ));
            return root.get("id").in(subquery);
        };
    }

    public static Specification<User> inProject(String projectHandle) {
        return (root, query, cb) -> {
            if (projectHandle == null) return null;
            Subquery<UUID> subquery = query.subquery(UUID.class);
            Root<ProjectMember> memberRoot = subquery.from(ProjectMember.class);
            Root<Project> projectRoot = subquery.from(Project.class);
            
            subquery.select(memberRoot.get("userId"))
                    .where(cb.and(
                        cb.equal(memberRoot.get("projectId"), projectRoot.get("id")),
                        cb.equal(projectRoot.get("handle"), projectHandle)
                    ));
            return root.get("id").in(subquery);
        };
    }
}
