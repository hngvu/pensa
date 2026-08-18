package soqe.pensa.api.label;

public record UpdateLabelRequest(
    String name,
    String backgroundColor,
    String textColor
) {}
