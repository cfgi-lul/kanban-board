package com.kanban.board.interfaces.websocket;

import com.kanban.task.interfaces.rest.TaskDTO;

public class TaskCreateMessage extends WebSocketMessage {
    private TaskDTO task;
    private Long columnId;

    public TaskCreateMessage() {
        super("TASK_CREATE", null, null);
    }

    public TaskCreateMessage(Long boardId, String userId, TaskDTO task, Long columnId) {
        super("TASK_CREATE", boardId, userId);
        this.task = task;
        this.columnId = columnId;
    }

    public TaskDTO getTask() {
        return task;
    }

    public void setTask(TaskDTO task) {
        this.task = task;
    }

    public Long getColumnId() {
        return columnId;
    }

    public void setColumnId(Long columnId) {
        this.columnId = columnId;
    }
} 