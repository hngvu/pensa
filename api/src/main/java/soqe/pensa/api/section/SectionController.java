package soqe.pensa.api.section;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    @GetMapping("/projects/{projectHandle}/sections")
    public List<SectionResponse> getSections(@PathVariable String projectHandle) {
        return sectionService.getSections(projectHandle);
    }

    @PostMapping("/projects/{projectHandle}/sections")
    @ResponseStatus(HttpStatus.CREATED)
    public SectionResponse createSection(
            @PathVariable String projectHandle,
            @Valid @RequestBody CreateSectionRequest request) {
        return sectionService.createSection(projectHandle, request);
    }

    @GetMapping("/sections/{handle}")
    public SectionResponse getSection(@PathVariable String handle) {
        return sectionService.getSection(handle);
    }

    @PatchMapping("/sections/{handle}")
    public SectionResponse updateSection(
            @PathVariable String handle,
            @Valid @RequestBody UpdateSectionRequest request) {
        return sectionService.updateSection(handle, request);
    }

    @PatchMapping("/sections/{handle}/move")
    public SectionResponse moveSection(
            @PathVariable String handle,
            @Valid @RequestBody MoveSectionRequest request) {
        return sectionService.moveSection(handle, request);
    }

    @DeleteMapping("/sections/{handle}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSection(@PathVariable String handle) {
        sectionService.deleteSection(handle);
    }
}
