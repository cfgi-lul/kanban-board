package Backend.Board.service;

import Backend.Board.model.BoardRoleType;
import Backend.Board.model.User;
import Backend.Board.repository.UserBoardRoleRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class BoardSecurityService {
    @Autowired
    private UserBoardRoleRepository userBoardRoleRepository;

    @Autowired
    private BoardRoleService boardRoleService;

    public boolean hasBoardPermission(Authentication authentication, Long boardId, BoardRoleType requiredRole) {
        User user = (User) authentication.getPrincipal();
        BoardRoleType userRole = boardRoleService.getUserRoleForBoard(user, boardId);
        
        return switch (requiredRole) {
            case ADMIN -> userRole == BoardRoleType.ADMIN;
            case WRITER -> userRole == BoardRoleType.ADMIN || userRole == BoardRoleType.WRITER;
            case READER -> userRole != null;
        };
    }

    public boolean hasBoardAccess(Authentication authentication, Long boardId) {
        User user = (User) authentication.getPrincipal();
        return userBoardRoleRepository.existsByUserAndBoardIdAndRoleIn(
                user,
                boardId,
                List.of(BoardRoleType.ADMIN, BoardRoleType.WRITER, BoardRoleType.READER)
        );
    }
}
