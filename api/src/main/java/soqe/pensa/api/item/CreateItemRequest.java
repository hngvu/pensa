package soqe.pensa.api.item;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

public record CreateItemRequest(
    @NotBlank(message = "Title is required") String title,
    @NotBlank(message = "Section handle is required") String sectionHandle,
    String description,
    String position,
    Instant startAt,
    Instant dueAt
) {}
