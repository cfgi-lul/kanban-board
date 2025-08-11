package com.kanban.task.application;

import com.kanban.task.domain.model.Task;
import com.kanban.task.domain.repository.TaskRepository;
import com.kanban.board.domain.model.BoardColumn;
import com.kanban.board.domain.repository.ColumnRepository;
import com.kanban.shared.domain.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class TaskPositionService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ColumnRepository columnRepository;



    /**
     * Move a task to a specific position within a column
     */
    public Task moveTaskToPosition(Task task, Integer newPosition) {
        if (newPosition < 0) {
            throw new IllegalArgumentException("Position cannot be negative");
        }

        BoardColumn column = task.getColumn();
        Integer currentPosition = task.getPosition();

        if (currentPosition.equals(newPosition)) {
            return task; // No change needed
        }

        if (newPosition > currentPosition) {
            // Moving down: shift tasks between current and new position up by 1
            List<Task> tasksToShift = taskRepository.findByColumnIdAndPositionGreaterThanEqualOrderByPositionAsc(
                    column.getId(), currentPosition + 1);
            
            for (Task taskToShift : tasksToShift) {
                if (taskToShift.getPosition() <= newPosition) {
                    taskToShift.setPosition(taskToShift.getPosition() - 1);
                    taskRepository.save(taskToShift);
                }
            }
        } else {
            // Moving up: shift tasks between new and current position down by 1
            List<Task> tasksToShift = taskRepository.findByColumnIdAndPositionGreaterThanEqualOrderByPositionAsc(
                    column.getId(), newPosition);
            
            for (Task taskToShift : tasksToShift) {
                if (taskToShift.getPosition() < currentPosition) {
                    taskToShift.setPosition(taskToShift.getPosition() + 1);
                    taskRepository.save(taskToShift);
                }
            }
        }

        task.setPosition(newPosition);
        return taskRepository.save(task);
    }



    /**
     * Move a task to a different column at a specific position
     */
    public Task moveTaskToColumn(Task task, BoardColumn newColumn, Integer newPosition) {
        if (newPosition < 0) {
            throw new IllegalArgumentException("Position cannot be negative");
        }

        BoardColumn oldColumn = task.getColumn();
        Integer oldPosition = task.getPosition();

        // If moving within the same column, use the simpler method
        if (oldColumn.getId().equals(newColumn.getId())) {
            return moveTaskToPosition(task, newPosition);
        }

        // Remove task from old column and shift other tasks
        if (oldPosition != null) {
            List<Task> tasksToShift = taskRepository.findByColumnIdAndPositionGreaterThanEqualOrderByPositionAsc(
                    oldColumn.getId(), oldPosition + 1);
            
            for (Task taskToShift : tasksToShift) {
                taskToShift.setPosition(taskToShift.getPosition() - 1);
                taskRepository.save(taskToShift);
            }
        }

        // Shift tasks in new column to make room
        List<Task> tasksToShift = taskRepository.findByColumnIdAndPositionGreaterThanEqualOrderByPositionAsc(
                newColumn.getId(), newPosition);
        
        for (Task taskToShift : tasksToShift) {
            taskToShift.setPosition(taskToShift.getPosition() + 1);
            taskRepository.save(taskToShift);
        }

        // Update task
        task.setColumn(newColumn);
        task.setPosition(newPosition);
        return taskRepository.save(task);
    }

    /**
     * Add a task to the end of a column
     */
    public Task addTaskToEndOfColumn(Task task, BoardColumn column) {
        Integer maxPosition = taskRepository.findMaxPositionByColumnId(column.getId());
        Integer newPosition = maxPosition + 1;
        
        task.setColumn(column);
        task.setPosition(newPosition);
        return taskRepository.save(task);
    }

    /**
     * Add a task to the beginning of a column
     */
    public Task addTaskToBeginningOfColumn(Task task, BoardColumn column) {
        // Shift all existing tasks down by 1
        List<Task> existingTasks = taskRepository.findByColumnIdOrderByPositionAsc(column.getId());
        
        for (Task existingTask : existingTasks) {
            existingTask.setPosition(existingTask.getPosition() + 1);
            taskRepository.save(existingTask);
        }

        task.setColumn(column);
        task.setPosition(0);
        return taskRepository.save(task);
    }

    /**
     * Remove a task from its column and reorder remaining tasks
     */
    public void removeTaskFromColumn(Task task) {
        BoardColumn column = task.getColumn();
        Integer position = task.getPosition();

        if (position != null) {
            // Shift all tasks after this position up by 1
            List<Task> tasksToShift = taskRepository.findByColumnIdAndPositionGreaterThanEqualOrderByPositionAsc(
                    column.getId(), position + 1);
            
            for (Task taskToShift : tasksToShift) {
                taskToShift.setPosition(taskToShift.getPosition() - 1);
                taskRepository.save(taskToShift);
            }
        }

        task.setColumn(null);
        task.setPosition(null);
        taskRepository.save(task);
    }


} 