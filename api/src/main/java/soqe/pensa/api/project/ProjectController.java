package soqe.pensa.api.project;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import soqe.pensa.api.common.response.PageResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // Workspace nested endpoints
    @GetMapping("/workspaces/{workspaceHandle}/projects")
    public PageResponse<ProjectResponse> getProjects(
            @PathVariable String workspaceHandle,
            @RequestParam(required = false) String name,
            @PageableDefault(size = 20) Pageable pageable) {
        return PageResponse.of(projectService.getProjects(workspaceHandle, name, pageable));
    }

    @PostMapping("/workspaces/{workspaceHandle}/projects")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(
            @PathVariable String workspaceHandle,
            @Valid @RequestBody CreateProjectRequest request) {
        return projectService.createProject(workspaceHandle, request);
    }

    // Project endpoints
    @GetMapping("/projects/{handle}")
    public ProjectResponse getProject(@PathVariable String handle) {
        return projectService.getProject(handle);
    }

    @PatchMapping("/projects/{handle}")
    public ProjectResponse updateProject(
            @PathVariable String handle,
            @Valid @RequestBody UpdateProjectRequest request) {
        return projectService.updateProject(handle, request);
    }

    @DeleteMapping("/projects/{handle}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable String handle) {
        projectService.deleteProject(handle);
    }

    // Members endpoints
    @GetMapping("/projects/{handle}/members")
    public List<ProjectMemberResponse> getMembers(@PathVariable String handle) {
        return projectService.getMembers(handle);
    }

    @PostMapping("/projects/{handle}/members")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectMemberResponse addMember(
            @PathVariable String handle,
            @Valid @RequestBody AddProjectMemberRequest request) {
        return projectService.addMember(handle, request);
    }

    @PatchMapping("/projects/{handle}/members/{userId}")
    public ProjectMemberResponse updateMemberRole(
            @PathVariable String handle,
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateProjectMemberRequest request) {
        return projectService.updateMemberRole(handle, userId, request);
    }

    @DeleteMapping("/projects/{handle}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(
            @PathVariable String handle,
            @PathVariable UUID userId) {
        projectService.removeMember(handle, userId);
    }
}
