package Backend.Board.controller;

import Backend.Board.dto.BoardDTO;
import Backend.Board.exception.ResourceNotFoundException;
import Backend.Board.mappers.BoardMapper;
import Backend.Board.model.Board;
import Backend.Board.model.BoardRoleType;
import Backend.Board.model.BoardColumn;
import Backend.Board.model.Task;
import Backend.Board.model.User;
import Backend.Board.repository.BoardRepository;
import Backend.Board.repository.UserRepository;
import Backend.Board.service.BoardRoleService;
import Backend.Board.service.BoardWebSocketService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    public ResponseEntity<BoardDTO> createBoard(@RequestBody BoardDTO boardDTO, 
                                               @AuthenticationPrincipal UserDetails userDetails) {
        try {
            System.out.println("Received board creation request: " + boardDTO);
            System.out.println("UserDetails: " + (userDetails != null ? userDetails.getUsername() : "null"));
            
            // Fetch the user who created the board
            User creator = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            System.out.println("Found creator: " + creator.getUsername());

            Board board = BoardMapper.toEntity(boardDTO);
            board.setCreatedBy(creator);
            System.out.println("Created board entity: " + board.getName());

            // Validate the board name
            if (board.getName() == null || board.getName().trim().isEmpty()) {
                System.out.println("Board name validation failed");
                return ResponseEntity.badRequest().build();
            }

            Board savedBoard = boardRepository.save(board);
            System.out.println("Successfully saved board with ID: " + savedBoard.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(BoardMapper.toDTO(savedBoard));
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error creating board: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
        // Implementation would depend on your BoardRoleService
        return ResponseEntity.ok(BoardRoleType.READER);
    }

    // Board sharing and invitation management
    @GetMapping("/{boardId}/invitation-code")
    public ResponseEntity<String> getBoardInvitationCode(@PathVariable Long boardId) {
        return boardRepository.findById(boardId)
                .map(board -> ResponseEntity.ok(board.getInvitationCode()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{boardId}/regenerate-invitation-code")
    public ResponseEntity<String> regenerateInvitationCode(@PathVariable Long boardId) {
        return boardRepository.findById(boardId)
                .map(board -> {
                    String newCode = "BOARD-" + System.currentTimeMillis() % 100000;
                    board.setInvitationCode(newCode);
                    boardRepository.save(board);
                    return ResponseEntity.ok(newCode);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/join/{invitationCode}")
    public ResponseEntity<BoardDTO> joinBoardByInvitationCode(@PathVariable String invitationCode,
                                                             @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Board board = boardRepository.findByInvitationCode(invitationCode)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid invitation code"));

        // Add user to board (implementation depends on your board-user relationship)
        if (board.getUsers() == null) {
            board.setUsers(new ArrayList<>());
        }
        if (!board.getUsers().contains(user)) {
            board.getUsers().add(user);
            boardRepository.save(board);
        }

        return ResponseEntity.ok(BoardMapper.toDTO(board));
    }

    // Board analytics and statistics
    @GetMapping("/{boardId}/analytics")
    public ResponseEntity<BoardAnalytics> getBoardAnalytics(@PathVariable Long boardId) {
        return boardRepository.findById(boardId)
                .map(board -> {
                    BoardAnalytics analytics = new BoardAnalytics();
                    analytics.setTotalTasks(board.getColumns().stream()
                            .mapToInt(col -> col.getTasks().size())
                            .sum());
                    analytics.setTotalColumns(board.getColumns().size());
                    analytics.setTotalUsers(board.getUsers() != null ? board.getUsers().size() : 0);
                    analytics.setCreatedAt(board.getCreatedAt());
                    return ResponseEntity.ok(analytics);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{boardId}/tasks-by-status")
    public ResponseEntity<StatusDistribution> getTasksByStatus(@PathVariable Long boardId) {
        return boardRepository.findById(boardId)
                .map(board -> {
                    StatusDistribution distribution = new StatusDistribution();
                    // Implementation would count tasks by status
                    return ResponseEntity.ok(distribution);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Board archiving
    @PutMapping("/{boardId}/archive")
    public ResponseEntity<BoardDTO> archiveBoard(@PathVariable Long boardId) {
        return boardRepository.findById(boardId)
                .map(board -> {
                    board.setArchived(true);
                    Board savedBoard = boardRepository.save(board);
                    return ResponseEntity.ok(BoardMapper.toDTO(savedBoard));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{boardId}/unarchive")
    public ResponseEntity<BoardDTO> unarchiveBoard(@PathVariable Long boardId) {
        return boardRepository.findById(boardId)
                .map(board -> {
                    board.setArchived(false);
                    Board savedBoard = boardRepository.save(board);
                    return ResponseEntity.ok(BoardMapper.toDTO(savedBoard));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/archived")
    public ResponseEntity<List<BoardDTO>> getArchivedBoards() {
        List<Board> archivedBoards = boardRepository.findByArchivedTrue();
        List<BoardDTO> boardDTOs = archivedBoards.stream()
                .map(BoardMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(boardDTOs);
    }

    // Board settings management
    @PutMapping("/{boardId}/settings")
    public ResponseEntity<BoardDTO> updateBoardSettings(@PathVariable Long boardId,
                                                       @RequestBody String settings) {
        return boardRepository.findById(boardId)
                .map(board -> {
                    board.setSettings(settings);
                    Board savedBoard = boardRepository.save(board);
                    return ResponseEntity.ok(BoardMapper.toDTO(savedBoard));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{boardId}/settings")
    public ResponseEntity<String> getBoardSettings(@PathVariable Long boardId) {
        return boardRepository.findById(boardId)
                .map(board -> ResponseEntity.ok(board.getSettings()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/random")
    public ResponseEntity<BoardDTO> createRandomBoard() {
        try {
            Random random = new Random();
            Board board = new Board();
            board.setName("Board-" + UUID.randomUUID().toString().substring(0, 8));

            List<BoardColumn> columns = new ArrayList<>();
            int columnCount = 2 + random.nextInt(4);

            List<String> shuffledColumnNames = new ArrayList<>(COLUMN_NAMES);
            Collections.shuffle(shuffledColumnNames);

            for (int i = 0; i < columnCount; i++) {
                BoardColumn column = new BoardColumn();
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

    // Analytics classes
    public static class BoardAnalytics {
        private int totalTasks;
        private int totalColumns;
        private int totalUsers;
        private java.time.LocalDateTime createdAt;

        // Getters and setters
        public int getTotalTasks() { return totalTasks; }
        public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }
        public int getTotalColumns() { return totalColumns; }
        public void setTotalColumns(int totalColumns) { this.totalColumns = totalColumns; }
        public int getTotalUsers() { return totalUsers; }
        public void setTotalUsers(int totalUsers) { this.totalUsers = totalUsers; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class StatusDistribution {
        private int todo;
        private int inProgress;
        private int review;
        private int done;

        // Getters and setters
        public int getTodo() { return todo; }
        public void setTodo(int todo) { this.todo = todo; }
        public int getInProgress() { return inProgress; }
        public void setInProgress(int inProgress) { this.inProgress = inProgress; }
        public int getReview() { return review; }
        public void setReview(int review) { this.review = review; }
        public int getDone() { return done; }
        public void setDone(int done) { this.done = done; }
    }
}
