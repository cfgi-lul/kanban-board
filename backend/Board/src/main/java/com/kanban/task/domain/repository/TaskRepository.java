package com.kanban.task.domain.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.kanban.task.domain.model.Task;





public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t JOIN FETCH t.column c JOIN FETCH c.board WHERE t.id = :id")
    Optional<Task> findByIdWithColumnAndBoard(@Param("id") Long id);
    
    // Find tasks by column ordered by position
    @Query("SELECT t FROM Task t WHERE t.column.id = :columnId ORDER BY t.position ASC")
    List<Task> findByColumnIdOrderByPositionAsc(@Param("columnId") Long columnId);
    
    // Find the maximum position in a column
    @Query("SELECT COALESCE(MAX(t.position), -1) FROM Task t WHERE t.column.id = :columnId")
    Integer findMaxPositionByColumnId(@Param("columnId") Long columnId);
    
    // Find tasks in a column with position greater than or equal to a given position
    @Query("SELECT t FROM Task t WHERE t.column.id = :columnId AND t.position >= :position ORDER BY t.position ASC")
    List<Task> findByColumnIdAndPositionGreaterThanEqualOrderByPositionAsc(@Param("columnId") Long columnId, @Param("position") Integer position);
}
