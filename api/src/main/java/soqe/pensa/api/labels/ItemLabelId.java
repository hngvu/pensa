package soqe.pensa.api.labels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemLabelId implements Serializable {
    private UUID itemId;
    private UUID labelId;
}
