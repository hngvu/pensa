package soqe.pensa.api.item;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import java.time.Instant;
import java.util.List;
import soqe.pensa.api.label.LabelResponse;

@Builder
public record ItemResponse(
    String handle,
    String slug,
    String title,
    String description,
    String position,
    @JsonProperty("isCompleted") boolean isCompleted,
    String projectId,
    String projectHandle,
    String projectSlug,
    String sectionId,
    String parentItemId,
    Instant startAt,
    Instant dueAt,
    List<LabelResponse> labels,
    Instant createdAt,
    Instant updatedAt
) {}
