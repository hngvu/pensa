package soqe.pensa.api.label;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ItemLabelRepository extends JpaRepository<ItemLabel, ItemLabelId> {
    List<ItemLabel> findByItemId(UUID itemId);
    void deleteByItemIdAndLabelId(UUID itemId, UUID labelId);
}
