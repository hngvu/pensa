package soqe.pensa.api.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping("/workspaces/{workspaceHandle}/activities")
    public List<ActivityResponse> getActivitiesByWorkspace(@PathVariable String workspaceHandle) {
        return activityService.getActivitiesByWorkspace(workspaceHandle);
    }

    @GetMapping("/projects/{projectHandle}/activities")
    public List<ActivityResponse> getActivitiesByProject(@PathVariable String projectHandle) {
        return activityService.getActivitiesByProject(projectHandle);
    }

    @GetMapping("/items/{itemHandle}/activities")
    public List<ActivityResponse> getActivitiesByItem(@PathVariable String itemHandle) {
        return activityService.getActivitiesByItem(itemHandle);
    }
}
