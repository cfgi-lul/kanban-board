package com.kanban.board.domain.repository;

import com.kanban.board.domain.model.UserBoardRole;
import com.kanban.board.domain.model.BoardRoleType;
import com.kanban.user.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;





@Repository
public interface UserBoardRoleRepository extends JpaRepository<UserBoardRole, Long> {
    boolean existsByUserAndBoardIdAndRoleIn(User user, Long boardId, List<BoardRoleType> roles);

    Optional<UserBoardRole> findByUserAndBoardId(User user, Long boardId);
}
