package Backend.Board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Backend.Board.model.Board;
import Backend.Board.model.BoardRoleType;
import Backend.Board.model.User;
import Backend.Board.model.UserBoardRole;
import Backend.Board.repository.UserBoardRoleRepository;

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