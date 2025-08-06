package com.kanban.board.domain.model;

import com.kanban.user.domain.model.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class UserBoardRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Board board;

    @Enumerated(EnumType.STRING)
    private BoardRoleType role;
}
