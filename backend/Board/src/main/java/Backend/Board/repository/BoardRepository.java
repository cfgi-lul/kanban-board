package Backend.Board.repository;

import Backend.Board.model.Board;
import Backend.Board.model.Column;
import Backend.Board.model.Task;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {
    @EntityGraph(attributePaths = "columns")
    Optional<Board> findWithColumnsById(Long id);

    @Query("SELECT c.tasks FROM Column c WHERE c IN :columns")
    List<Task> findTasksByColumns(@Param("columns") List<Column> columns);
}