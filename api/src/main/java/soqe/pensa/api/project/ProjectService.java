package soqe.pensa.api.project;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import soqe.pensa.api.common.CurrentUserProvider;
import soqe.pensa.api.common.HandleGenerator;
import soqe.pensa.api.common.SlugUtils;
import soqe.pensa.api.exception.BusinessException;
import soqe.pensa.api.exception.ResourceNotFoundException;
import soqe.pensa.api.user.User;
import soqe.pensa.api.user.UserResponse;
import soqe.pensa.api.user.UserService;
import soqe.pensa.api.workspace.WorkspaceService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final WorkspaceService workspaceService;
    private final UserService userService;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public ProjectResponse createProject(String workspaceHandle, CreateProjectRequest request) {
        UUID workspaceId = workspaceService.getWorkspaceId(workspaceHandle);
                
        User currentUser = currentUserProvider.getCurrentUser();

        String handle = HandleGenerator.generate();

        Project project = new Project();
        project.setWorkspaceId(workspaceId);
        project.setName(request.name());
        project.setHandle(handle);
        project.setSlug(SlugUtils.toSlug(request.name()));
        project.setIconUrl(request.iconUrl());
        project.setLeadId(request.leadId() != null ? request.leadId() : currentUser.getId());
        project.setIssueCounter(0);
        
        project = projectRepository.save(project);

        ProjectMember member = new ProjectMember();
        member.setProjectId(project.getId());
        member.setUserId(currentUser.getId());
        member.setRole(ProjectRole.PROJECT_ADMIN);
        projectMemberRepository.save(member);

        return ProjectResponse.builder()
                .handle(project.getHandle())
                .name(project.getName())
                .slug(project.getSlug())
                .iconUrl(project.getIconUrl())
                .workspaceId(project.getWorkspaceId().toString())
                .leadId(project.getLeadId() != null ? project.getLeadId().toString() : null)
                .issueCounter(project.getIssueCounter())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getProjects(String workspaceHandle, String name, Pageable pageable) {
        UUID workspaceId = workspaceService.getWorkspaceId(workspaceHandle);

        Specification<Project> spec = Specification.where(ProjectSpecification.withWorkspaceId(workspaceId));
        if (name != null) spec = spec.and(ProjectSpecification.withName(name));
        
        return projectRepository.findAll(spec, pageable).map(project -> ProjectResponse.builder()
                .handle(project.getHandle())
                .name(project.getName())
                .slug(project.getSlug())
                .iconUrl(project.getIconUrl())
                .workspaceId(project.getWorkspaceId().toString())
                .leadId(project.getLeadId() != null ? project.getLeadId().toString() : null)
                .issueCounter(project.getIssueCounter())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(String handle) {
        Project project = getProjectEntity(handle);
        return ProjectResponse.builder()
                .handle(project.getHandle())
                .name(project.getName())
                .slug(project.getSlug())
                .iconUrl(project.getIconUrl())
                .workspaceId(project.getWorkspaceId().toString())
                .leadId(project.getLeadId() != null ? project.getLeadId().toString() : null)
                .issueCounter(project.getIssueCounter())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    @Transactional
    public ProjectResponse updateProject(String handle, UpdateProjectRequest request) {
        Project project = getProjectEntity(handle);
        
        if (request.name() != null) {
            project.setName(request.name());
            project.setSlug(SlugUtils.toSlug(request.name()));
        }
        if (request.iconUrl() != null) project.setIconUrl(request.iconUrl());
        if (request.leadId() != null) project.setLeadId(request.leadId());

        project = projectRepository.save(project);

        return ProjectResponse.builder()
                .handle(project.getHandle())
                .name(project.getName())
                .slug(project.getSlug())
                .iconUrl(project.getIconUrl())
                .workspaceId(project.getWorkspaceId().toString())
                .leadId(project.getLeadId() != null ? project.getLeadId().toString() : null)
                .issueCounter(project.getIssueCounter())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    @Transactional
    public void deleteProject(String handle) {
        Project project = getProjectEntity(handle);
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectMemberResponse addMember(String handle, AddProjectMemberRequest request) {
        Project project = getProjectEntity(handle);
        
        // This will throw IllegalArgumentException if user is not found, which is caught by ControllerAdvice
        UserResponse userResponse = userService.getUserById(request.userId());

        if (projectMemberRepository.findByProjectIdAndUserId(project.getId(), request.userId()).isPresent()) {
            throw new BusinessException("User is already a member of this project");
        }

        ProjectMember member = new ProjectMember();
        member.setProjectId(project.getId());
        member.setUserId(request.userId());
        member.setRole(request.role());
        projectMemberRepository.save(member);

        return ProjectMemberResponse.builder()
                .projectHandle(project.getHandle())
                .user(userResponse)
                .role(member.getRole())
                .joinedAt(member.getCreatedAt())
                .build();
    }

    @Transactional
    public ProjectMemberResponse updateMemberRole(String handle, UUID userId, UpdateProjectMemberRequest request) {
        Project project = getProjectEntity(handle);
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(project.getId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in project"));

        member.setRole(request.role());
        projectMemberRepository.save(member);

        UserResponse userResponse = userService.getUserById(userId);

        return ProjectMemberResponse.builder()
                .projectHandle(project.getHandle())
                .user(userResponse)
                .role(member.getRole())
                .joinedAt(member.getCreatedAt())
                .build();
    }

    @Transactional
    public void removeMember(String handle, UUID userId) {
        Project project = getProjectEntity(handle);
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(project.getId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in project"));
                
        projectMemberRepository.delete(member);
    }

    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getMembers(String handle) {
        Project project = getProjectEntity(handle);
        List<ProjectMember> members = projectMemberRepository.findAllByProjectId(project.getId());
        
        return members.stream().map(member -> {
            UserResponse userResponse = null;
            try {
                userResponse = userService.getUserById(member.getUserId());
            } catch (Exception e) {
                // Ignore if user is deleted or not found
            }
            
            return ProjectMemberResponse.builder()
                    .projectHandle(project.getHandle())
                    .user(userResponse)
                    .role(member.getRole())
                    .joinedAt(member.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UUID getProjectId(String handle) {
        return getProjectEntity(handle).getId();
    }

    private Project getProjectEntity(String handle) {
        return projectRepository.findByHandle(handle)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }
}
