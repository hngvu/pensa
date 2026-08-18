package soqe.pensa.api.label;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import soqe.pensa.api.exception.ResourceNotFoundException;
import soqe.pensa.api.project.ProjectService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabelService {

    private final LabelRepository labelRepository;
    private final ProjectService projectService;

    @Transactional
    public LabelResponse createLabel(String projectHandle, CreateLabelRequest request) {
        UUID projectId = projectService.getProjectId(projectHandle);

        Label label = new Label();
        label.setProjectId(projectId);
        label.setName(request.name());
        label.setBackgroundColor(request.backgroundColor());
        label.setTextColor(request.textColor());

        label = labelRepository.save(label);

        return mapToResponse(label);
    }

    @Transactional(readOnly = true)
    public List<LabelResponse> getLabelsByProject(String projectHandle) {
        UUID projectId = projectService.getProjectId(projectHandle);

        return labelRepository.findAllByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LabelResponse updateLabel(UUID id, UpdateLabelRequest request) {
        Label label = labelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found"));

        if (request.name() != null) label.setName(request.name());
        if (request.backgroundColor() != null) label.setBackgroundColor(request.backgroundColor());
        if (request.textColor() != null) label.setTextColor(request.textColor());

        label = labelRepository.save(label);
        return mapToResponse(label);
    }

    @Transactional
    public void deleteLabel(UUID id) {
        Label label = labelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found"));
                
        // Label is just AuditableEntity, so this will be a hard delete
        labelRepository.delete(label);
    }

    private LabelResponse mapToResponse(Label label) {
        return LabelResponse.builder()
                .id(label.getId())
                .name(label.getName())
                .backgroundColor(label.getBackgroundColor())
                .textColor(label.getTextColor())
                .projectId(label.getProjectId().toString())
                .createdAt(label.getCreatedAt())
                .updatedAt(label.getUpdatedAt())
                .build();
    }
}
