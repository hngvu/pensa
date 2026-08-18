package soqe.pensa.api.label;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @GetMapping("/projects/{projectHandle}/labels")
    public List<LabelResponse> getLabelsByProject(@PathVariable String projectHandle) {
        return labelService.getLabelsByProject(projectHandle);
    }

    @PostMapping("/projects/{projectHandle}/labels")
    @ResponseStatus(HttpStatus.CREATED)
    public LabelResponse createLabel(
            @PathVariable String projectHandle,
            @Valid @RequestBody CreateLabelRequest request) {
        return labelService.createLabel(projectHandle, request);
    }

    @PatchMapping("/labels/{id}")
    public LabelResponse updateLabel(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateLabelRequest request) {
        return labelService.updateLabel(id, request);
    }

    @DeleteMapping("/labels/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLabel(@PathVariable UUID id) {
        labelService.deleteLabel(id);
    }
}
