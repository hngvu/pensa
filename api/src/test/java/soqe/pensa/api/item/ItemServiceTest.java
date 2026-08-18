package soqe.pensa.api.item;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import soqe.pensa.api.exception.ResourceNotFoundException;
import soqe.pensa.api.project.ProjectService;
import soqe.pensa.api.section.SectionResponse;
import soqe.pensa.api.section.SectionService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private SectionService sectionService;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ItemService itemService;

    private UUID projectId;
    private UUID sectionId;
    private SectionResponse sectionResponse;
    private Item item;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        sectionId = UUID.randomUUID();

        sectionResponse = SectionResponse.builder()
                .handle("SEC12345")
                .projectId(projectId.toString())
                .build();

        item = new Item();
        ReflectionTestUtils.setField(item, "id", UUID.randomUUID());
        item.setProjectId(projectId);
        item.setSectionId(sectionId);
        item.setHandle("ITM12345");
        item.setTitle("Test Item");
        item.setSlug("test-item");
        item.setPosition("a");
        item.setCompleted(false);
        ReflectionTestUtils.setField(item, "createdAt", Instant.now());
        ReflectionTestUtils.setField(item, "updatedAt", Instant.now());
    }

    @Test
    void createItem_Success() {
        // Arrange
        CreateItemRequest request = new CreateItemRequest("New Task", "SEC12345", "Desc", "a", null, null);
        when(sectionService.getSection("SEC12345")).thenReturn(sectionResponse);
        when(sectionService.getSectionId("SEC12345")).thenReturn(sectionId);
        when(itemRepository.save(any(Item.class))).thenAnswer(invocation -> {
            Item savedItem = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedItem, "id", UUID.randomUUID());
            ReflectionTestUtils.setField(savedItem, "createdAt", Instant.now());
            ReflectionTestUtils.setField(savedItem, "updatedAt", Instant.now());
            return savedItem;
        });

        // Act
        ItemResponse response = itemService.createItem(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.title()).isEqualTo("New Task");
        assertThat(response.projectId()).isEqualTo(projectId.toString());
        assertThat(response.sectionId()).isEqualTo(sectionId.toString());
        assertThat(response.handle()).isNotNull();
        
        verify(sectionService).getSection("SEC12345");
        verify(sectionService).getSectionId("SEC12345");
        verify(itemRepository).save(any(Item.class));
    }

    @Test
    void getItemsByProject_Success() {
        // Arrange
        when(projectService.getProjectId("PRJ12345")).thenReturn(projectId);
        when(itemRepository.findAllByProjectId(projectId)).thenReturn(List.of(item));

        // Act
        List<ItemResponse> items = itemService.getItemsByProject("PRJ12345");

        // Assert
        assertThat(items).hasSize(1);
        assertThat(items.get(0).handle()).isEqualTo("ITM12345");
        assertThat(items.get(0).title()).isEqualTo("Test Item");
    }

    @Test
    void updateItem_Success() {
        // Arrange
        UpdateItemRequest request = new UpdateItemRequest("Updated Task", null, true, null, null, null, null);
        when(itemRepository.findByHandle("ITM12345")).thenReturn(Optional.of(item));
        when(itemRepository.save(any(Item.class))).thenReturn(item);

        // Act
        ItemResponse response = itemService.updateItem("ITM12345", request);

        // Assert
        assertThat(response.title()).isEqualTo("Updated Task");
        assertThat(response.isCompleted()).isTrue();
        verify(itemRepository).save(item);
    }

    @Test
    void getItem_NotFound_ThrowsException() {
        // Arrange
        when(itemRepository.findByHandle("INVALID")).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            itemService.getItem("INVALID");
        });

        assertThat(exception.getMessage()).isEqualTo("Item not found");
    }

    @Test
    void deleteItem_Success() {
        // Arrange
        when(itemRepository.findByHandle("ITM12345")).thenReturn(Optional.of(item));

        // Act
        itemService.deleteItem("ITM12345");

        // Assert
        verify(itemRepository).delete(item);
    }
}
