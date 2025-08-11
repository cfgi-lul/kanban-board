package com.kanban.task.application;

import com.kanban.task.domain.model.Task;
import com.kanban.task.domain.repository.TaskRepository;
import com.kanban.board.domain.model.Board;
import com.kanban.board.domain.model.BoardColumn;
import com.kanban.board.domain.repository.BoardRepository;
import com.kanban.board.domain.repository.ColumnRepository;
import com.kanban.user.domain.model.User;
import com.kanban.user.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class TaskPositionServiceTest {

    @Autowired
    private TaskPositionService taskPositionService;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private UserRepository userRepository;

    private Board testBoard;
    private BoardColumn testColumn;
    private User testUser;
    private Task task1, task2, task3;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password");
        testUser = userRepository.save(testUser);

        // Create test board
        testBoard = new Board();
        testBoard.setName("Test Board");
        testBoard.setDescription("Test Board Description");
        testBoard = boardRepository.save(testBoard);

        // Create test column
        testColumn = new BoardColumn();
        testColumn.setName("Test Column");
        testColumn.setOrderIndex(0);
        testColumn.setBoard(testBoard);
        testColumn = columnRepository.save(testColumn);

        // Create test tasks
        task1 = new Task();
        task1.setTitle("Task 1");
        task1.setDescription("First task");
        task1.setCreatedBy(testUser);

        task2 = new Task();
        task2.setTitle("Task 2");
        task2.setDescription("Second task");
        task2.setCreatedBy(testUser);

        task3 = new Task();
        task3.setTitle("Task 3");
        task3.setDescription("Third task");
        task3.setCreatedBy(testUser);
    }

    @Test
    void testAddTaskToEndOfColumn() {
        // Add tasks to end of column
        Task savedTask1 = taskPositionService.addTaskToEndOfColumn(task1, testColumn);
        Task savedTask2 = taskPositionService.addTaskToEndOfColumn(task2, testColumn);
        Task savedTask3 = taskPositionService.addTaskToEndOfColumn(task3, testColumn);

        // Verify positions
        assertEquals(0, savedTask1.getPosition());
        assertEquals(1, savedTask2.getPosition());
        assertEquals(2, savedTask3.getPosition());
    }

    @Test
    void testAddTaskToBeginningOfColumn() {
        // Add first task to end
        Task savedTask1 = taskPositionService.addTaskToEndOfColumn(task1, testColumn);
        
        // Add second task to beginning
        Task savedTask2 = taskPositionService.addTaskToBeginningOfColumn(task2, testColumn);

        // Verify positions
        assertEquals(1, savedTask1.getPosition()); // Shifted down
        assertEquals(0, savedTask2.getPosition()); // At beginning
    }

    @Test
    void testMoveTaskToPosition() {
        // Add tasks to column
        Task savedTask1 = taskPositionService.addTaskToEndOfColumn(task1, testColumn);
        Task savedTask2 = taskPositionService.addTaskToEndOfColumn(task2, testColumn);
        Task savedTask3 = taskPositionService.addTaskToEndOfColumn(task3, testColumn);

        // Move task1 from position 0 to position 2
        taskPositionService.moveTaskToPosition(savedTask1, 2);
        Task movedTask = taskRepository.save(savedTask1);

        // Verify new positions
        assertEquals(2, movedTask.getPosition());
        
        // Verify other tasks were shifted
        List<Task> tasks = taskRepository.findByColumnIdOrderByPositionAsc(testColumn.getId());
        assertEquals(0, tasks.get(0).getPosition()); // task2
        assertEquals(1, tasks.get(1).getPosition()); // task3
        assertEquals(2, tasks.get(2).getPosition()); // task1 (moved)
    }

    @Test
    void testGetTasksInColumnOrdered() {
        // Add tasks in random order
        taskPositionService.addTaskToEndOfColumn(task3, testColumn);
        taskPositionService.addTaskToEndOfColumn(task1, testColumn);
        taskPositionService.addTaskToEndOfColumn(task2, testColumn);

        // Get ordered tasks
        List<Task> orderedTasks = taskRepository.findByColumnIdOrderByPositionAsc(testColumn.getId());

        // Verify order
        assertEquals(3, orderedTasks.size());
        assertEquals(0, orderedTasks.get(0).getPosition());
        assertEquals(1, orderedTasks.get(1).getPosition());
        assertEquals(2, orderedTasks.get(2).getPosition());
    }

    @Test
    void testReorderColumnTasks() {
        // Add tasks and manually set some positions to be non-consecutive
        Task savedTask1 = taskPositionService.addTaskToEndOfColumn(task1, testColumn);
        Task savedTask2 = taskPositionService.addTaskToEndOfColumn(task2, testColumn);
        Task savedTask3 = taskPositionService.addTaskToEndOfColumn(task3, testColumn);

        // Manually set non-consecutive positions
        savedTask1.setPosition(5);
        savedTask2.setPosition(10);
        savedTask3.setPosition(15);
        taskRepository.saveAll(List.of(savedTask1, savedTask2, savedTask3));

        // Reorder to make positions consecutive
        List<Task> tasksToReorder = taskRepository.findByColumnIdOrderByPositionAsc(testColumn.getId());
        for (int i = 0; i < tasksToReorder.size(); i++) {
            Task task = tasksToReorder.get(i);
            if (!task.getPosition().equals(i)) {
                task.setPosition(i);
                taskRepository.save(task);
            }
        }

        // Verify positions are now consecutive
        List<Task> tasks = taskRepository.findByColumnIdOrderByPositionAsc(testColumn.getId());
        assertEquals(0, tasks.get(0).getPosition());
        assertEquals(1, tasks.get(1).getPosition());
        assertEquals(2, tasks.get(2).getPosition());
    }
} 