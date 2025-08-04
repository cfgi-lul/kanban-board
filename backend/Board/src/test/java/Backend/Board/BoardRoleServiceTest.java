package Backend.Board;

import Backend.Board.model.Board;
import Backend.Board.model.BoardRoleType;
import Backend.Board.model.User;
import Backend.Board.model.UserBoardRole;
import Backend.Board.repository.UserBoardRoleRepository;
import Backend.Board.service.BoardRoleService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
public class BoardRoleServiceTest {

    @Mock
    private UserBoardRoleRepository userBoardRoleRepository;

    @InjectMocks
    private BoardRoleService boardRoleService;

    @Test
    public void testAssignRoleToUser() {
        User user = new User();
        user.setId(1L);

        Board board = new Board();
        board.setId(1L);

        boardRoleService.assignRoleToUser(user, board, BoardRoleType.ADMIN);

        verify(userBoardRoleRepository, times(1)).save(any(UserBoardRole.class));
    }
}