package com.kanban.board.interfaces.websocket;

public class TaskMoveMessage extends WebSocketMessage {
    private Long taskId;
    private Long previousColumnId;
    private Long currentColumnId;
    private Integer previousIndex;
    private Integer currentIndex;

    public TaskMoveMessage() {
        super("TASK_MOVE", null, null);
    }

    public TaskMoveMessage(Long boardId, String userId, Long taskId, Long previousColumnId, 
                          Long currentColumnId, Integer previousIndex, Integer currentIndex) {
        super("TASK_MOVE", boardId, userId);
        this.taskId = taskId;
        this.previousColumnId = previousColumnId;
        this.currentColumnId = currentColumnId;
        this.previousIndex = previousIndex;
        this.currentIndex = currentIndex;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getPreviousColumnId() {
        return previousColumnId;
    }

    public void setPreviousColumnId(Long previousColumnId) {
        this.previousColumnId = previousColumnId;
    }

    public Long getCurrentColumnId() {
        return currentColumnId;
    }

    public void setCurrentColumnId(Long currentColumnId) {
        this.currentColumnId = currentColumnId;
    }

    public Integer getPreviousIndex() {
        return previousIndex;
    }

    public void setPreviousIndex(Integer previousIndex) {
        this.previousIndex = previousIndex;
    }

    public Integer getCurrentIndex() {
        return currentIndex;
    }

    public void setCurrentIndex(Integer currentIndex) {
        this.currentIndex = currentIndex;
    }
} 