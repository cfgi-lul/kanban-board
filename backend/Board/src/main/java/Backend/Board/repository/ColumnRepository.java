package Backend.Board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Backend.Board.model.BoardColumn;

public interface ColumnRepository extends JpaRepository<BoardColumn, Long> {}