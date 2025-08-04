package Backend.Board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Backend.Board.model.Column;

public interface ColumnRepository extends JpaRepository<Column, Long> {}