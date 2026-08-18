package soqe.pensa.api.section;

import jakarta.validation.constraints.NotBlank;

public record CreateSectionRequest(
    @NotBlank(message = "Section name is required") String name,
    String position
) {}
