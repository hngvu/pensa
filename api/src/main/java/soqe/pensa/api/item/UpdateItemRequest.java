package soqe.pensa.api.item;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public record UpdateItemRequest(
    String title,
    String description,
    @JsonProperty("isCompleted") Boolean isCompleted,
    String position,
    String sectionHandle,
    Instant startAt,
    Instant dueAt
) {}
