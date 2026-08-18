package soqe.pensa.api.workspace;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import soqe.pensa.api.common.response.PageResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkspaceResponse createWorkspace(@Valid @RequestBody CreateWorkspaceRequest request) {
        return workspaceService.createWorkspace(request);
    }

    @GetMapping
    public PageResponse<WorkspaceResponse> getWorkspaces(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) WorkspaceVisibility visibility,
            @ParameterObject Pageable pageable) {
        Page<WorkspaceResponse> page = workspaceService.getWorkspaces(name, visibility, pageable);
        return PageResponse.of(page);
    }

    @GetMapping("/{handle}")
    public WorkspaceResponse getWorkspace(@PathVariable String handle) {
        return workspaceService.getWorkspace(handle);
    }

    @PatchMapping("/{handle}")
    public WorkspaceResponse updateWorkspace(
            @PathVariable String handle,
            @Valid @RequestBody UpdateWorkspaceRequest request) {
        return workspaceService.updateWorkspace(handle, request);
    }

    @DeleteMapping("/{handle}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWorkspace(@PathVariable String handle) {
        workspaceService.deleteWorkspace(handle);
    }

    @PostMapping("/{handle}/members")
    @ResponseStatus(HttpStatus.CREATED)
    public WorkspaceMemberResponse addMember(
            @PathVariable String handle,
            @Valid @RequestBody AddWorkspaceMemberRequest request) {
        return workspaceService.addMember(handle, request);
    }

    @GetMapping("/{handle}/members")
    public List<WorkspaceMemberResponse> getMembers(@PathVariable String handle) {
        return workspaceService.getMembers(handle);
    }

    @PatchMapping("/{handle}/members/{userId}")
    public WorkspaceMemberResponse updateMemberRole(
            @PathVariable String handle,
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateWorkspaceMemberRequest request) {
        return workspaceService.updateMemberRole(handle, userId, request);
    }

    @DeleteMapping("/{handle}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(
            @PathVariable String handle,
            @PathVariable UUID userId) {
        workspaceService.removeMember(handle, userId);
    }
}
