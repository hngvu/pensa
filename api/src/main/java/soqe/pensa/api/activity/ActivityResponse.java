package soqe.pensa.api.activity;

import lombok.Builder;
import java.time.Instant;
import java.util.UUID;

@Builder
public record ActivityResponse(
    UUID id,
    String entityType,
    String entityId,
    String actorId,
    String actionType,
    String fieldName,
    String oldValue,
    String newValue,
    Instant createdAt
) {}
