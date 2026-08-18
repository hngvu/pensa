package soqe.pensa.api.section;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SectionRepository extends JpaRepository<Section, UUID> {
    Optional<Section> findByHandle(String handle);
    boolean existsByHandle(String handle);
    List<Section> findAllByProjectIdOrderByPositionAsc(UUID projectId);
}
