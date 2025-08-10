package com.kanban.board.interfaces.websocket;

public class TaskDeleteMessage extends WebSocketMessage {
    private Long taskId;

    public TaskDeleteMessage() {
        super("TASK_DELETE", null, null);
    }

    public TaskDeleteMessage(Long boardId, String userId, Long taskId) {
        super("TASK_DELETE", boardId, userId);
        this.taskId = taskId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
} 