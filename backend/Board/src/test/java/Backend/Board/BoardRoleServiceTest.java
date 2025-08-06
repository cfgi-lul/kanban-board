package Backend.Board;


import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import com.kanban.board.application.BoardRoleService;
import com.kanban.board.domain.model.Board;
import com.kanban.board.domain.model.BoardRoleType;
import com.kanban.board.domain.model.UserBoardRole;
import com.kanban.board.domain.repository.UserBoardRoleRepository;
import com.kanban.user.domain.model.User;

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