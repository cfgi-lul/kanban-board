package com.kanban.shared.interfaces.websocket;

import com.kanban.shared.interfaces.rest.CommentDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentWebSocketMessage {
    /**
     * One of: CREATED, UPDATED, DELETED
     */
    private String type;

    private Long taskId;

    /**
     * Present for CREATED/UPDATED events
     */
    private CommentDTO comment;

    /**
     * Present for DELETED events
     */
    private Long commentId;
}

