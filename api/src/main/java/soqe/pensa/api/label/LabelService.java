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
    private final ItemLabelRepository itemLabelRepository;
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
    public void assignLabelToItem(UUID itemId, UUID labelId) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found"));
        ItemLabelId id = new ItemLabelId();
        id.setItemId(itemId);
        id.setLabelId(labelId);
        if (!itemLabelRepository.existsById(id)) {
            ItemLabel itemLabel = new ItemLabel();
            itemLabel.setItemId(itemId);
            itemLabel.setLabelId(labelId);
            itemLabelRepository.save(itemLabel);
        }
    }

    @Transactional
    public void removeLabelFromItem(UUID itemId, UUID labelId) {
        itemLabelRepository.deleteByItemIdAndLabelId(itemId, labelId);
    }

    @Transactional(readOnly = true)
    public List<LabelResponse> getLabelsByItem(UUID itemId) {
        List<UUID> labelIds = itemLabelRepository.findByItemId(itemId).stream()
                .map(ItemLabel::getLabelId)
                .toList();
        if (labelIds.isEmpty()) return List.of();
        return labelRepository.findAllById(labelIds).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void deleteLabel(UUID id) {
        Label label = labelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found"));
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
