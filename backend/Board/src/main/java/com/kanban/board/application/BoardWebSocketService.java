package com.kanban.board.application;

import com.kanban.board.interfaces.rest.BoardDTO;
import com.kanban.board.interfaces.rest.ColumnDTO;
import com.kanban.task.interfaces.rest.TaskDTO;
import com.kanban.shared.infrastructure.BoardMapper;
import com.kanban.shared.infrastructure.TaskMapper;
import com.kanban.board.domain.model.Board;
import com.kanban.board.domain.model.BoardColumn;
import com.kanban.task.domain.model.Task;
import com.kanban.task.domain.model.TaskPriority;
import com.kanban.task.domain.model.TaskStatus;
import com.kanban.board.domain.repository.BoardRepository;
import com.kanban.board.domain.repository.ColumnRepository;
import com.kanban.task.domain.repository.TaskRepository;
import com.kanban.board.interfaces.websocket.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

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

    @Transactional
    public WebSocketResponse handleTaskMove(TaskMoveMessage message) {
        try {
            System.out.println("Handling task move: " + message.getTaskId());
            
            Task task = taskRepository.findById(message.getTaskId())
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + message.getTaskId()));
            
            BoardColumn newColumn = columnRepository.findById(message.getCurrentColumnId())
                    .orElseThrow(() -> new RuntimeException("Column not found with id: " + message.getCurrentColumnId()));
            
            // Update task column and position
            task.setColumn(newColumn);
            
            // Set the new position based on the current index from the drag and drop operation
            if (message.getCurrentIndex() != null) {
                task.setPosition(message.getCurrentIndex());
            }
            
            taskRepository.save(task);
            taskRepository.flush(); // Force flush to ensure changes are persisted
            
            // Get updated board state with columns
            Board board = boardRepository.findWithColumnsAndTasksById(message.getBoardId())
                    .orElseThrow(() -> new RuntimeException("Board not found with id: " + message.getBoardId()));
            
            // Manually load tasks for each column with position ordering
            board.getColumns().forEach(col -> {
                List<Task> tasks = taskRepository.findByColumnIdOrderByPositionAsc(col.getId());
                // Clear and add tasks to avoid orphan deletion issues
                col.getTasks().clear();
                col.getTasks().addAll(tasks);
            });
            
            BoardDTO boardDTO = BoardMapper.toDTO(board);
            
            // Send response to all clients
            WebSocketResponse response = new WebSocketResponse(
                "TASK_MOVE_RESPONSE", 
                "SUCCESS", 
                "Task moved successfully", 
                boardDTO
            );
            
            System.out.println("Sending WebSocket response: " + response);
            messagingTemplate.convertAndSend("/topic/board/" + message.getBoardId(), response);
            
            return response;
        } catch (Exception e) {
            System.err.println("Error handling task move: " + e.getMessage());
            WebSocketResponse errorResponse = new WebSocketResponse(
                "TASK_MOVE_RESPONSE", 
                "ERROR", 
                "Failed to move task: " + e.getMessage()
            );
            
            messagingTemplate.convertAndSend("/topic/board/" + message.getBoardId(), errorResponse);
            return errorResponse;
        }
    }

    @Transactional
    public WebSocketResponse handleTaskCreate(TaskCreateMessage message) {
        try {
            System.out.println("Handling task create in column: " + message.getColumnId());
            
            BoardColumn column = columnRepository.findById(message.getColumnId())
                    .orElseThrow(() -> new RuntimeException("Column not found with id: " + message.getColumnId()));
            
            Task task = TaskMapper.toEntity(message.getTask());
            task.setColumn(column);
            
            // Set position to the end of the column if not specified
            if (task.getPosition() == null) {
                Integer maxPosition = taskRepository.findMaxPositionByColumnId(column.getId());
                task.setPosition(maxPosition != null ? maxPosition + 1 : 0);
            }
            
            Task savedTask = taskRepository.save(task);
            taskRepository.flush(); // Force flush to ensure changes are persisted
            
            // Get updated board state with columns
            Board board = boardRepository.findWithColumnsAndTasksById(message.getBoardId())
                    .orElseThrow(() -> new RuntimeException("Board not found with id: " + message.getBoardId()));
            
            // Manually load tasks for each column with position ordering
            board.getColumns().forEach(col -> {
                List<Task> tasks = taskRepository.findByColumnIdOrderByPositionAsc(col.getId());
                // Clear and add tasks to avoid orphan deletion issues
                col.getTasks().clear();
                col.getTasks().addAll(tasks);
            });
            
            BoardDTO boardDTO = BoardMapper.toDTO(board);
            
            WebSocketResponse response = new WebSocketResponse(
                "TASK_CREATE_RESPONSE", 
                "SUCCESS", 
                "Task created successfully", 
                boardDTO
            );
            
            messagingTemplate.convertAndSend("/topic/board/" + message.getBoardId(), response);
            
            return response;
        } catch (Exception e) {
            System.err.println("Error handling task create: " + e.getMessage());
            WebSocketResponse errorResponse = new WebSocketResponse(
                "TASK_CREATE_RESPONSE", 
                "ERROR", 
                "Failed to create task: " + e.getMessage()
            );
            
            messagingTemplate.convertAndSend("/topic/board/" + message.getBoardId(), errorResponse);
            return errorResponse;
        }
    }

    @Transactional
    public WebSocketResponse handleTaskUpdate(TaskUpdateMessage message) {
        try {
            System.out.println("Handling task update: " + message.getTask().getId());
            
            Task existingTask = taskRepository.findById(message.getTask().getId())
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + message.getTask().getId()));
            
            // Update task fields
            existingTask.setTitle(message.getTask().getTitle());
            existingTask.setDescription(message.getTask().getDescription());
            existingTask.setDueDate(message.getTask().getDueDate());
            
            if (message.getTask().getPriority() != null) {
                try {
                    existingTask.setPriority(TaskPriority.valueOf(message.getTask().getPriority()));
                } catch (IllegalArgumentException e) {
                    // Keep existing priority if invalid value
                }
            }
            
            if (message.getTask().getStatus() != null) {
                try {
                    existingTask.setStatus(TaskStatus.valueOf(message.getTask().getStatus()));
                } catch (IllegalArgumentException e) {
                    // Keep existing status if invalid value
                }
            }
            
            taskRepository.save(existingTask);
            taskRepository.flush(); // Force flush to ensure changes are persisted
            
            // Get updated board state with columns and tasks
            Board board = boardRepository.findWithColumnsAndTasksById(message.getBoardId())
                    .orElseThrow(() -> new RuntimeException("Board not found with id: " + message.getBoardId()));
            
            BoardDTO boardDTO = BoardMapper.toDTO(board);
            
            WebSocketResponse response = new WebSocketResponse(
                "TASK_UPDATE_RESPONSE", 
                "SUCCESS", 
                "Task updated successfully", 
                boardDTO
            );
            
            messagingTemplate.convertAndSend("/topic/board/" + message.getBoardId(), response);
            
            return response;
        } catch (Exception e) {
            System.err.println("Error handling task update: " + e.getMessage());
            WebSocketResponse errorResponse = new WebSocketResponse(
                "TASK_UPDATE_RESPONSE", 
                "ERROR", 
                "Failed to update task: " + e.getMessage()
            );
            
            messagingTemplate.convertAndSend("/topic/board/" + message.getBoardId(), errorResponse);
            return errorResponse;
        }
    }

    @Transactional
    public WebSocketResponse handleTaskDelete(TaskDeleteMessage message) {
        try {
            System.out.println("Handling task delete: " + message.getTaskId());
            
            Task task = taskRepository.findById(message.getTaskId())
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + message.getTaskId()));
            
            Long boardId = task.getColumn().getBoard().getId();
            taskRepository.delete(task);
            taskRepository.flush(); // Force flush to ensure changes are persisted
            
            // Get updated board state with columns
            Board board = boardRepository.findWithColumnsAndTasksById(boardId)
                    .orElseThrow(() -> new RuntimeException("Board not found with id: " + boardId));
            
            // Manually load tasks for each column to avoid multiple bag fetch issue
            board.getColumns().forEach(col -> {
                col.getTasks().size(); // Force lazy loading of tasks
            });
            
            BoardDTO boardDTO = BoardMapper.toDTO(board);
            
            WebSocketResponse response = new WebSocketResponse(
                "TASK_DELETE_RESPONSE", 
                "SUCCESS", 
                "Task deleted successfully", 
                boardDTO
            );
            
            messagingTemplate.convertAndSend("/topic/board/" + boardId, response);
            
            return response;
        } catch (Exception e) {
            System.err.println("Error handling task delete: " + e.getMessage());
            WebSocketResponse errorResponse = new WebSocketResponse(
                "TASK_DELETE_RESPONSE", 
                "ERROR", 
                "Failed to delete task: " + e.getMessage()
            );
            
            messagingTemplate.convertAndSend("/topic/board/" + message.getBoardId(), errorResponse);
            return errorResponse;
        }
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
