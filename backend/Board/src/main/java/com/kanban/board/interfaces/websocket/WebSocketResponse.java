package com.kanban.board.interfaces.websocket;

import com.kanban.board.interfaces.rest.BoardDTO;

public class WebSocketResponse {
    private String type;
    private String status; // SUCCESS, ERROR
    private String message;
    private BoardDTO board;
    private Long timestamp;

    public WebSocketResponse() {
        this.timestamp = System.currentTimeMillis();
    }

    public WebSocketResponse(String type, String status, String message) {
        this.type = type;
        this.status = status;
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }

    public WebSocketResponse(String type, String status, String message, BoardDTO board) {
        this.type = type;
        this.status = status;
        this.message = message;
        this.board = board;
        this.timestamp = System.currentTimeMillis();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BoardDTO getBoard() {
        return board;
    }

    public void setBoard(BoardDTO board) {
        this.board = board;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "WebSocketResponse{" +
                "type='" + type + '\'' +
                ", status='" + status + '\'' +
                ", message='" + message + '\'' +
                ", board=" + (board != null ? "BoardDTO(id=" + board.getId() + ")" : "null") +
                ", timestamp=" + timestamp +
                '}';
    }
} 