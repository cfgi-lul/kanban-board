package com.kanban.board.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kanban.board.domain.model.BoardColumn;




public interface ColumnRepository extends JpaRepository<BoardColumn, Long> {}
