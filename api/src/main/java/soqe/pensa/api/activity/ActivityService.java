package soqe.pensa.api.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import soqe.pensa.api.item.ItemService;
import soqe.pensa.api.project.ProjectService;
import soqe.pensa.api.workspace.WorkspaceService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final WorkspaceService workspaceService;
    private final ProjectService projectService;
    private final ItemService itemService;

    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivitiesByWorkspace(String workspaceHandle) {
        UUID workspaceId = workspaceService.getWorkspaceId(workspaceHandle);

        return activityRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivitiesByProject(String projectHandle) {
        UUID projectId = projectService.getProjectId(projectHandle);

        return activityRepository.findAllByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivitiesByItem(String itemHandle) {
        UUID itemId = itemService.getItemId(itemHandle);

        return activityRepository.findAllByEntityIdOrderByCreatedAtDesc(itemId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void logActivity(ActivityLog activityLog) {
        activityRepository.save(activityLog);
    }

    private ActivityResponse mapToResponse(ActivityLog log) {
        return ActivityResponse.builder()
                .id(log.getId())
                .entityType(log.getEntityType() != null ? log.getEntityType().name() : null)
                .entityId(log.getEntityId() != null ? log.getEntityId().toString() : null)
                .actorId(log.getActorId() != null ? log.getActorId().toString() : null)
                .actionType(log.getActionType() != null ? log.getActionType().name() : null)
                .fieldName(log.getFieldName())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
