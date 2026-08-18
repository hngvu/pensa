package soqe.pensa.api.label;

import jakarta.validation.constraints.NotBlank;

public record CreateLabelRequest(
    @NotBlank(message = "Name is required") String name,
    String backgroundColor,
    String textColor
) {}
