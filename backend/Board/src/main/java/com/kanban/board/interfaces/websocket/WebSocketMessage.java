package com.kanban.board.interfaces.websocket;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = TaskMoveMessage.class, name = "TASK_MOVE"),
    @JsonSubTypes.Type(value = TaskCreateMessage.class, name = "TASK_CREATE"),
    @JsonSubTypes.Type(value = TaskUpdateMessage.class, name = "TASK_UPDATE"),
    @JsonSubTypes.Type(value = TaskDeleteMessage.class, name = "TASK_DELETE"),
    @JsonSubTypes.Type(value = BoardUpdateMessage.class, name = "BOARD_UPDATE")
})
public abstract class WebSocketMessage {
    private String type;
    private Long boardId;
    private String userId;
    private Long timestamp;

    public WebSocketMessage() {
        this.timestamp = System.currentTimeMillis();
    }

    public WebSocketMessage(String type, Long boardId, String userId) {
        this.type = type;
        this.boardId = boardId;
        this.userId = userId;
        this.timestamp = System.currentTimeMillis();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getBoardId() {
        return boardId;
    }

    public void setBoardId(Long boardId) {
        this.boardId = boardId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
} 