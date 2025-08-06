package Backend.Board.service;

import Backend.Board.dto.BoardDTO;
import Backend.Board.dto.ColumnDTO;
import Backend.Board.dto.TaskDTO;
import Backend.Board.mappers.BoardMapper;
import Backend.Board.model.Board;
import Backend.Board.model.BoardColumn;
import Backend.Board.model.Task;
import Backend.Board.repository.BoardRepository;
import Backend.Board.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BoardWebSocketService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Transactional
    public BoardDTO handleBoardUpdate(Long boardId, BoardDTO updatedBoardDTO) {
        System.out.println("Handling board update for board: " + boardId);
        Board existingBoard = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found with id: " + boardId));

        existingBoard.setName(updatedBoardDTO.getName());
        updateColumns(existingBoard, updatedBoardDTO.getColumns());
        Board savedBoard = boardRepository.save(existingBoard);
        return BoardMapper.toDTO(savedBoard);
    }

    private void updateColumns(Board existingBoard, List<ColumnDTO> updatedColumns) {
        Map<Long, BoardColumn> existingColumnsMap = existingBoard.getColumns().stream()
                .collect(Collectors.toMap(BoardColumn::getId, c -> c));

        List<BoardColumn> newColumns = new ArrayList<>();

        for (ColumnDTO columnDTO : updatedColumns) {
            BoardColumn column = existingColumnsMap.getOrDefault(columnDTO.getId(), new BoardColumn());
            column.setName(columnDTO.getName());
            column.setBoard(existingBoard);
            updateTasks(column, columnDTO.getTasks());
            newColumns.add(column);
            existingColumnsMap.remove(column.getId());
        }

        existingBoard.getColumns().removeAll(existingColumnsMap.values());
        existingBoard.getColumns().clear();
        existingBoard.getColumns().addAll(newColumns);
    }

    private void updateTasks(BoardColumn column, List<TaskDTO> updatedTasks) {
        Map<Long, Task> existingTasksMap = column.getTasks().stream()
                .collect(Collectors.toMap(Task::getId, t -> t));

        List<Task> newTasks = new ArrayList<>();

        for (TaskDTO taskDTO : updatedTasks) {
            Task task = existingTasksMap.getOrDefault(taskDTO.getId(), new Task());
            Optional<Task> taskInRepo = taskRepository.findById(taskDTO.getId());

            task.setColumn(column);
            task.setTitle(taskInRepo.get().getTitle());
            task.setDescription(taskInRepo.get().getDescription());
            task.setComments(taskInRepo.get().getComments());

            newTasks.add(task);
            existingTasksMap.remove(task.getId());
        }

        column.getTasks().removeAll(existingTasksMap.values());
        column.getTasks().clear();
        column.getTasks().addAll(newTasks);
    }
}
