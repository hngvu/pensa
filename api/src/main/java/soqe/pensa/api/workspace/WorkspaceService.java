package soqe.pensa.api.workspace;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import soqe.pensa.api.common.CurrentUserProvider;
import soqe.pensa.api.common.HandleGenerator;
import soqe.pensa.api.exception.BusinessException;
import soqe.pensa.api.exception.ResourceNotFoundException;
import soqe.pensa.api.user.User;
import soqe.pensa.api.user.UserRepository;
import soqe.pensa.api.user.UserResponse;

import java.text.Normalizer;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public WorkspaceResponse createWorkspace(CreateWorkspaceRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();
        UUID currentUserId = currentUser.getId();

        String handle = HandleGenerator.generate();

        Workspace workspace = new Workspace();
        workspace.setName(request.name());
        workspace.setHandle(handle);
            workspace.setSlug(soqe.pensa.api.common.SlugUtils.toSlug(request.name()));
        workspace.setAvatarUrl(request.avatarUrl());
        workspace.setVisibility(request.visibility());
        workspace.setSettings(request.settings());
        workspace.setOwnerId(currentUserId);
        
        workspace = workspaceRepository.save(workspace);

        WorkspaceMember member = new WorkspaceMember();
        member.setWorkspaceId(workspace.getId());
        member.setUserId(currentUserId);
        member.setRole(WorkspaceRole.WORKSPACE_OWNER);
        workspaceMemberRepository.save(member);

        return WorkspaceResponse.builder()
                .handle(workspace.getHandle())
                .name(workspace.getName())
                .slug(workspace.getSlug())
                .avatarUrl(workspace.getAvatarUrl())
                .ownerId(workspace.getOwnerId() != null ? workspace.getOwnerId().toString() : null)
                .visibility(workspace.getVisibility())
                .settings(workspace.getSettings())
                .createdAt(workspace.getCreatedAt())
                .updatedAt(workspace.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<WorkspaceResponse> getWorkspaces(String name, WorkspaceVisibility visibility, Pageable pageable) {
        Specification<Workspace> spec = Specification.where((Specification<Workspace>) null);
        if (name != null) spec = spec.and(WorkspaceSpecification.withName(name));
        if (visibility != null) spec = spec.and(WorkspaceSpecification.withVisibility(visibility));
        
        return workspaceRepository.findAll(spec, pageable).map(workspace -> WorkspaceResponse.builder()
                .handle(workspace.getHandle())
                .name(workspace.getName())
                .slug(workspace.getSlug())
                .avatarUrl(workspace.getAvatarUrl())
                .ownerId(workspace.getOwnerId() != null ? workspace.getOwnerId().toString() : null)
                .visibility(workspace.getVisibility())
                .settings(workspace.getSettings())
                .createdAt(workspace.getCreatedAt())
                .updatedAt(workspace.getUpdatedAt())
                .build());
    }

    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspace(String handle) {
        Workspace workspace = getWorkspaceEntity(handle);
        return WorkspaceResponse.builder()
                .handle(workspace.getHandle())
                .name(workspace.getName())
                .slug(workspace.getSlug())
                .avatarUrl(workspace.getAvatarUrl())
                .ownerId(workspace.getOwnerId() != null ? workspace.getOwnerId().toString() : null)
                .visibility(workspace.getVisibility())
                .settings(workspace.getSettings())
                .createdAt(workspace.getCreatedAt())
                .updatedAt(workspace.getUpdatedAt())
                .build();
    }

    @Transactional
    public WorkspaceResponse updateWorkspace(String handle, UpdateWorkspaceRequest request) {
        Workspace workspace = getWorkspaceEntity(handle);
        
        if (request.name() != null) {
            workspace.setName(request.name());
            workspace.setSlug(soqe.pensa.api.common.SlugUtils.toSlug(request.name()));
        }
        if (request.avatarUrl() != null) workspace.setAvatarUrl(request.avatarUrl());
        if (request.visibility() != null) workspace.setVisibility(request.visibility());
        if (request.settings() != null) workspace.setSettings(request.settings());

        workspace = workspaceRepository.save(workspace);

        return WorkspaceResponse.builder()
                .handle(workspace.getHandle())
                .name(workspace.getName())
                .slug(workspace.getSlug())
                .avatarUrl(workspace.getAvatarUrl())
                .ownerId(workspace.getOwnerId() != null ? workspace.getOwnerId().toString() : null)
                .visibility(workspace.getVisibility())
                .settings(workspace.getSettings())
                .createdAt(workspace.getCreatedAt())
                .updatedAt(workspace.getUpdatedAt())
                .build();
    }

    @Transactional
    public void deleteWorkspace(String handle) {
        Workspace workspace = getWorkspaceEntity(handle);
        workspaceRepository.delete(workspace);
    }

    @Transactional
    public WorkspaceMemberResponse addMember(String handle, AddWorkspaceMemberRequest request) {
        Workspace workspace = getWorkspaceEntity(handle);
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (workspaceMemberRepository.findByWorkspaceIdAndUserId(workspace.getId(), user.getId()).isPresent()) {
            throw new BusinessException("User is already a member of this workspace");
        }

        WorkspaceMember member = new WorkspaceMember();
        member.setWorkspaceId(workspace.getId());
        member.setUserId(user.getId());
        member.setRole(request.role());
        workspaceMemberRepository.save(member);

        return WorkspaceMemberResponse.builder()
                .workspaceHandle(workspace.getHandle())
                .user(UserResponse.fromEntity(user))
                .role(member.getRole())
                .joinedAt(member.getCreatedAt())
                .build();
    }

    @Transactional
    public WorkspaceMemberResponse updateMemberRole(String handle, UUID userId, UpdateWorkspaceMemberRequest request) {
        Workspace workspace = getWorkspaceEntity(handle);
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserId(workspace.getId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in workspace"));

        member.setRole(request.role());
        workspaceMemberRepository.save(member);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return WorkspaceMemberResponse.builder()
                .workspaceHandle(workspace.getHandle())
                .user(UserResponse.fromEntity(user))
                .role(member.getRole())
                .joinedAt(member.getCreatedAt())
                .build();
    }

    @Transactional
    public void removeMember(String handle, UUID userId) {
        Workspace workspace = getWorkspaceEntity(handle);
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserId(workspace.getId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in workspace"));
                
        workspaceMemberRepository.delete(member);
    }

    @Transactional(readOnly = true)
    public List<WorkspaceMemberResponse> getMembers(String handle) {
        Workspace workspace = getWorkspaceEntity(handle);
        List<WorkspaceMember> members = workspaceMemberRepository.findAllByWorkspaceId(workspace.getId());
        
        return members.stream().map(member -> {
            User user = userRepository.findById(member.getUserId()).orElse(null);
            UserResponse userResponse = user != null ? UserResponse.fromEntity(user) : null;
            
            return WorkspaceMemberResponse.builder()
                    .workspaceHandle(workspace.getHandle())
                    .user(userResponse)
                    .role(member.getRole())
                    .joinedAt(member.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UUID getWorkspaceId(String handle) {
        return getWorkspaceEntity(handle).getId();
    }

    private Workspace getWorkspaceEntity(String handle) {
        return workspaceRepository.findByHandle(handle)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
    }


}
