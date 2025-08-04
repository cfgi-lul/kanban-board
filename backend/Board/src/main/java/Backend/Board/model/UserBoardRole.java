package Backend.Board.model;

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
