package com.kanban.board.domain.repository;

import com.kanban.board.domain.model.Board;
import com.kanban.board.domain.model.BoardColumn;
import com.kanban.task.domain.model.Task;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;





@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    @EntityGraph(attributePaths = "columns")
    Optional<Board> findWithColumnsById(Long id);

    @Query("SELECT c.tasks FROM BoardColumn c WHERE c IN :columns")
    List<Task> findTasksByColumns(@Param("columns") List<BoardColumn> columns);
    
    /**
     * Find board by invitation code
     */
    Optional<Board> findByInvitationCode(String invitationCode);
    
    /**
     * Find all archived boards
     */
    List<Board> findByArchivedTrue();
    
    /**
     * Find all non-archived boards
     */
    List<Board> findByArchivedFalse();
    
    /**
     * Find boards by creator ID
     */
    List<Board> findByCreatedByIdOrderByCreatedAtDesc(Long createdById);
    
    /**
     * Find boards by user ID (boards where user is a member)
     */
    @Query("SELECT DISTINCT b FROM Board b JOIN b.users u WHERE u.id = :userId")
    List<Board> findByUserId(@Param("userId") Long userId);
    
    /**
     * Count boards by creator ID
     */
    long countByCreatedById(Long createdById);
    
    /**
     * Check if board exists by invitation code
     */
    boolean existsByInvitationCode(String invitationCode);
}
