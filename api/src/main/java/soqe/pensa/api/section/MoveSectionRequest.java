package soqe.pensa.api.section;

import jakarta.validation.constraints.NotBlank;

public record MoveSectionRequest(
    @NotBlank(message = "Position is required") String position
) {}
