package soqe.pensa.api.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {
    Optional<Item> findByHandle(String handle);
    boolean existsByHandle(String handle);
    List<Item> findAllByProjectId(UUID projectId);
}
