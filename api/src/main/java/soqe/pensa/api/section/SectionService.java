package soqe.pensa.api.section;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import soqe.pensa.api.common.HandleGenerator;
import soqe.pensa.api.common.SlugUtils;
import soqe.pensa.api.exception.ResourceNotFoundException;
import soqe.pensa.api.project.ProjectService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectionService {

    private final SectionRepository sectionRepository;
    private final ProjectService projectService;

    @Transactional
    public SectionResponse createSection(String projectHandle, CreateSectionRequest request) {
        UUID projectId = projectService.getProjectId(projectHandle);

        String handle = HandleGenerator.generate();

        Section section = new Section();
        section.setProjectId(projectId);
        section.setName(request.name());
        section.setHandle(handle);
        section.setSlug(SlugUtils.toSlug(request.name()));
        section.setPosition(request.position() != null ? request.position() : "0");

        section = sectionRepository.save(section);

        return mapToResponse(section);
    }

    @Transactional(readOnly = true)
    public List<SectionResponse> getSections(String projectHandle) {
        UUID projectId = projectService.getProjectId(projectHandle);

        return sectionRepository.findAllByProjectIdOrderByPositionAsc(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SectionResponse getSection(String handle) {
        Section section = getSectionEntity(handle);
        return mapToResponse(section);
    }

    @Transactional
    public SectionResponse updateSection(String handle, UpdateSectionRequest request) {
        Section section = getSectionEntity(handle);
        section.setName(request.name());
        section.setSlug(SlugUtils.toSlug(request.name()));
        
        section = sectionRepository.save(section);
        return mapToResponse(section);
    }

    @Transactional
    public SectionResponse moveSection(String handle, MoveSectionRequest request) {
        Section section = getSectionEntity(handle);
        section.setPosition(request.position());
        
        section = sectionRepository.save(section);
        return mapToResponse(section);
    }

    @Transactional
    public void deleteSection(String handle) {
        Section section = getSectionEntity(handle);
        sectionRepository.delete(section);
    }

    @Transactional(readOnly = true)
    public UUID getSectionId(String handle) {
        return getSectionEntity(handle).getId();
    }

    private Section getSectionEntity(String handle) {
        return sectionRepository.findByHandle(handle)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
    }

    private SectionResponse mapToResponse(Section section) {
        return SectionResponse.builder()
                .id(section.getId().toString())
                .handle(section.getHandle())
                .name(section.getName())
                .slug(section.getSlug())
                .position(section.getPosition())
                .projectId(section.getProjectId().toString())
                .createdAt(section.getCreatedAt())
                .updatedAt(section.getUpdatedAt())
                .build();
    }
}
