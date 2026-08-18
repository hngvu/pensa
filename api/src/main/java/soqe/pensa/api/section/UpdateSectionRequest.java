package soqe.pensa.api.section;

import jakarta.validation.constraints.NotBlank;

public record UpdateSectionRequest(
    @NotBlank(message = "Section name is required") String name
) {}
