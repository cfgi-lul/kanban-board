package com.kanban.board.interfaces.websocket;

import com.kanban.board.interfaces.rest.BoardDTO;

public class BoardUpdateMessage extends WebSocketMessage {
    private BoardDTO board;

    public BoardUpdateMessage() {
        super("BOARD_UPDATE", null, null);
    }

    public BoardUpdateMessage(Long boardId, String userId, BoardDTO board) {
        super("BOARD_UPDATE", boardId, userId);
        this.board = board;
    }

    public BoardDTO getBoard() {
        return board;
    }

    public void setBoard(BoardDTO board) {
        this.board = board;
    }
} 