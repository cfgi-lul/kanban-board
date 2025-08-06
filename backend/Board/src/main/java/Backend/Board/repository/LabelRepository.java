package Backend.Board.repository;

import Backend.Board.model.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {
    
    /**
     * Find all labels by board ID
     */
    List<Label> findByBoardIdOrderByCreatedAtDesc(Long boardId);
    
    /**
     * Find label by name and board ID
     */
    Label findByNameAndBoardId(String name, Long boardId);
    
    /**
     * Check if label exists by name and board ID
     */
    boolean existsByNameAndBoardId(String name, Long boardId);
    
    /**
     * Find labels by board ID with pagination
     */
    @Query("SELECT l FROM Label l WHERE l.board.id = :boardId ORDER BY l.createdAt DESC")
    List<Label> findLabelsByBoardId(@Param("boardId") Long boardId);
    
    /**
     * Count labels by board ID
     */
    long countByBoardId(Long boardId);
} 