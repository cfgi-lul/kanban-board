package com.kanban.board.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kanban.board.domain.model.Board;
import com.kanban.board.domain.model.BoardRoleType;
import com.kanban.user.domain.model.User;
import com.kanban.board.domain.model.UserBoardRole;
import com.kanban.board.domain.repository.UserBoardRoleRepository;

@Service
public class BoardRoleService {
    @Autowired
    private UserBoardRoleRepository userBoardRoleRepository;
    
    public void assignRoleToUser(User user, Board board, BoardRoleType role) {
        UserBoardRole userBoardRole = new UserBoardRole();
        userBoardRole.setUser(user);
        userBoardRole.setBoard(board);
        userBoardRole.setRole(role);
        userBoardRoleRepository.save(userBoardRole);
    }

    public BoardRoleType getUserRoleForBoard(User user, Long boardId) {
        return userBoardRoleRepository.findByUserAndBoardId(user, boardId)
                .map(UserBoardRole::getRole)
                .orElse(null);
    }
}
