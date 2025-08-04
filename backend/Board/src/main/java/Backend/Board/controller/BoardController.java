package Backend.Board.controller;

import Backend.Board.dto.BoardDTO;
import Backend.Board.exception.ResourceNotFoundException;
import Backend.Board.mappers.BoardMapper;
import Backend.Board.model.Board;
import Backend.Board.model.BoardRoleType;
import Backend.Board.model.Column;
import Backend.Board.model.Task;
import Backend.Board.model.User;
import Backend.Board.repository.BoardRepository;
import Backend.Board.repository.UserRepository;
import Backend.Board.service.BoardRoleService;
import Backend.Board.service.BoardWebSocketService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@Controller
@RequestMapping("/boards")
@SecurityRequirement(name = "bearerAuth")
public class BoardController {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardWebSocketService boardWebSocketService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BoardRoleService boardRoleService;

    private static final List<String> COLUMN_NAMES = Arrays.asList("Backlog", "To Do", "In Progress", "Review", "Done");

    @GetMapping
    public List<BoardDTO> getAllBoards(@RequestParam(required = false) Long id) {
        List<Board> boards = id != null ? boardRepository.findById(id).map(List::of)
                .orElseThrow(() -> new RuntimeException("Board not found")) : boardRepository.findAll();

        return boards.stream()
                .map(BoardMapper::toDTO)
                .collect(Collectors.toList());
    }

    @MessageMapping("/board/{boardId}/update")
    @SendTo("/topic/board/{boardId}")
    public BoardDTO updateBoard(
            @DestinationVariable Long boardId,
            Message<BoardDTO> message) {
        return boardWebSocketService.handleBoardUpdate(boardId, message.getPayload());
    }

    @PostMapping
    public BoardDTO createBoard(@RequestBody BoardDTO board) {
        return BoardMapper.toDTO(boardRepository.save(BoardMapper.toEntity(board)));
    }

    @DeleteMapping
    public void deleteBoard(@RequestParam Long id) {
        boardRepository.deleteById(id);
    }

    @PostMapping("/{boardId}/users/{userId}/role")
    @PreAuthorize("@boardSecurityService.hasBoardAccess(authentication, #boardId)")
    public ResponseEntity<?> assignUserRoleToBoard(
            @PathVariable Long boardId,
            @PathVariable Long userId,
            @RequestParam BoardRoleType role) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boardRoleService.assignRoleToUser(user, board, role);
        return ResponseEntity.ok("Role assigned");
    }

    @GetMapping("/{boardId}/users/{userId}/role")
    public ResponseEntity<BoardRoleType> getUserBoardRole(
            @PathVariable Long boardId,
            @PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(boardRoleService.getUserRoleForBoard(user, boardId));
    }

    @PostMapping("/random")
    public ResponseEntity<BoardDTO> createRandomBoard() {
        try {
            Random random = new Random();
            Board board = new Board();
            board.setName("Board-" + UUID.randomUUID().toString().substring(0, 8));

            List<Column> columns = new ArrayList<>();
            int columnCount = 2 + random.nextInt(4);

            List<String> shuffledColumnNames = new ArrayList<>(COLUMN_NAMES);
            Collections.shuffle(shuffledColumnNames);

            for (int i = 0; i < columnCount; i++) {
                Column column = new Column();
                String columnName = i < shuffledColumnNames.size()
                        ? shuffledColumnNames.get(i)
                        : "Column " + (i + 1);
                column.setName(columnName);
                column.setBoard(board);

                List<Task> tasks = new ArrayList<>();
                int taskCount = 1 + random.nextInt(6);

                for (int j = 0; j < taskCount; j++) {
                    Task task = new Task();
                    task.setTitle("Task " + (j + 1));
                    task.setDescription("Sample description for " + columnName);
                    task.setColumn(column);
                    tasks.add(task);
                }
                column.setTasks(tasks);
                columns.add(column);
            }

            board.setColumns(columns);
            Board savedBoard = boardRepository.save(board);
            return ResponseEntity.ok(BoardMapper.toDTO(savedBoard));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
