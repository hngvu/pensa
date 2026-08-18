package soqe.pensa.api.item;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import soqe.pensa.api.common.HandleGenerator;
import soqe.pensa.api.common.SlugUtils;
import soqe.pensa.api.exception.ResourceNotFoundException;
import soqe.pensa.api.project.ProjectService;
import soqe.pensa.api.section.SectionResponse;
import soqe.pensa.api.section.SectionService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final SectionService sectionService;
    private final ProjectService projectService;

    @Transactional
    public ItemResponse createItem(CreateItemRequest request) {
        SectionResponse sectionResponse = sectionService.getSection(request.sectionHandle());
        UUID sectionId = sectionService.getSectionId(request.sectionHandle());
        UUID projectId = UUID.fromString(sectionResponse.projectId());

        String handle = HandleGenerator.generate();

        Item item = new Item();
        item.setProjectId(projectId);
        item.setSectionId(sectionId);
        item.setTitle(request.title());
        item.setHandle(handle);
        item.setSlug(SlugUtils.toSlug(request.title()));
        item.setDescription(request.description());
        item.setPosition(request.position() != null ? request.position() : "0");
        item.setStartAt(request.startAt());
        item.setDueAt(request.dueAt());
        item.setCompleted(false);

        item = itemRepository.save(item);

        return mapToResponse(item);
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getItemsByProject(String projectHandle) {
        UUID projectId = projectService.getProjectId(projectHandle);

        return itemRepository.findAllByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ItemResponse getItem(String handle) {
        return mapToResponse(getItemEntity(handle));
    }

    @Transactional
    public ItemResponse updateItem(String handle, UpdateItemRequest request) {
        Item item = getItemEntity(handle);

        if (request.title() != null) {
            item.setTitle(request.title());
            item.setSlug(SlugUtils.toSlug(request.title()));
        }
        if (request.description() != null) item.setDescription(request.description());
        if (request.isCompleted() != null) item.setCompleted(request.isCompleted());
        if (request.position() != null) item.setPosition(request.position());
        if (request.startAt() != null) item.setStartAt(request.startAt());
        if (request.dueAt() != null) item.setDueAt(request.dueAt());
        
        if (request.sectionHandle() != null) {
            UUID sectionId = sectionService.getSectionId(request.sectionHandle());
            item.setSectionId(sectionId);
        }

        item = itemRepository.save(item);
        return mapToResponse(item);
    }

    @Transactional
    public void deleteItem(String handle) {
        Item item = getItemEntity(handle);
        itemRepository.delete(item);
    }

    @Transactional(readOnly = true)
    public UUID getItemId(String handle) {
        return getItemEntity(handle).getId();
    }

    private Item getItemEntity(String handle) {
        return itemRepository.findByHandle(handle)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
    }

    private ItemResponse mapToResponse(Item item) {
        return ItemResponse.builder()
                .handle(item.getHandle())
                .slug(item.getSlug())
                .title(item.getTitle())
                .description(item.getDescription())
                .position(item.getPosition())
                .isCompleted(item.isCompleted())
                .projectId(item.getProjectId().toString())
                .sectionId(item.getSectionId().toString())
                .parentItemId(item.getParentItemId() != null ? item.getParentItemId().toString() : null)
                .startAt(item.getStartAt())
                .dueAt(item.getDueAt())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
