package Backend.Board;

import Backend.Board.model.User;
import org.junit.jupiter.api.Test;
import Backend.Board.model.Task;
import Backend.Board.dto.TaskDTO;
import Backend.Board.mappers.TaskMapper;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class TaskDTOTest {

    @Test
    public void testTaskDTOMapping() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("This is a test task");
        task.setCreatedBy(user);
        task.setAssignee(user);
        task.setComments(Collections.emptyList());

        TaskDTO taskDTO = TaskMapper.toDTO(task);

        assertNotNull(taskDTO);
        assertEquals(1L, taskDTO.getId());
        assertEquals("Test Task", taskDTO.getTitle());
        assertEquals("This is a test task", taskDTO.getDescription());
        assertEquals(1L, taskDTO.getCreatedBy().getId());
        assertEquals(1L, taskDTO.getAssignee().getId());
        assertTrue(taskDTO.getComments().isEmpty());
    }
}