package com.kanban.shared.infrastructure;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.kanban.shared.domain.model.Comment;





public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTaskIdOrderByCreatedAtDesc(Long taskId);
}
