package soqe.pensa.api.item;

import java.time.Instant;

public record UpdateItemRequest(
    String title,
    String description,
    Boolean isCompleted,
    String position,
    String sectionHandle,
    Instant startAt,
    Instant dueAt
) {}
