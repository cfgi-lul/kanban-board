package Backend.Board;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kanban.board.domain.model.Board;
import com.kanban.board.domain.model.BoardColumn;
import com.kanban.board.domain.repository.BoardRepository;
import com.kanban.board.interfaces.rest.BoardController;
import com.kanban.board.interfaces.rest.BoardDTO;
import com.kanban.task.domain.model.Task;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BoardControllerTest {

    @Mock
    private BoardRepository boardRepository;

    @InjectMocks
    private BoardController boardController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateRandomBoard() {
        // Arrange
        Board savedBoard = new Board();
        savedBoard.setId(1L);
        savedBoard.setName("Board-12345678");
        
        List<BoardColumn> columns = new ArrayList<>();
        BoardColumn column1 = new BoardColumn();
        column1.setId(1L);
        column1.setName("To Do");
        column1.setBoard(savedBoard);
        
        List<Task> tasks = new ArrayList<>();
        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");
        task1.setDescription("Sample description for To Do");
        task1.setColumn(column1);
        tasks.add(task1);
        
        column1.setTasks(tasks);
        columns.add(column1);
        
        savedBoard.setColumns(columns);
        
        when(boardRepository.save(any(Board.class))).thenReturn(savedBoard);

        // Act
        ResponseEntity<BoardDTO> response = boardController.createRandomBoard();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        BoardDTO boardDTO = response.getBody();
        assertTrue(boardDTO.getName().startsWith("Board-"));
        assertNotNull(boardDTO.getColumns());
        assertFalse(boardDTO.getColumns().isEmpty());
        
        // Verify that the board was saved
        verify(boardRepository).save(any(Board.class));
    }

    @Test
    void testCreateRandomBoardWithException() {
        // Arrange
        when(boardRepository.save(any(Board.class))).thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<BoardDTO> response = boardController.createRandomBoard();

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());
    }
} 