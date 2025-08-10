package com.kanban.board.interfaces.websocket;

import com.kanban.task.interfaces.rest.TaskDTO;

public class TaskUpdateMessage extends WebSocketMessage {
    private TaskDTO task;

    public TaskUpdateMessage() {
        super("TASK_UPDATE", null, null);
    }

    public TaskUpdateMessage(Long boardId, String userId, TaskDTO task) {
        super("TASK_UPDATE", boardId, userId);
        this.task = task;
    }

    public TaskDTO getTask() {
        return task;
    }

    public void setTask(TaskDTO task) {
        this.task = task;
    }
} 