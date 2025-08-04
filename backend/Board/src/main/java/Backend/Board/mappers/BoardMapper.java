package Backend.Board.mappers;

import Backend.Board.dto.BoardDTO;
import Backend.Board.dto.ColumnDTO;
import Backend.Board.model.Board;
import Backend.Board.model.Column;
import java.util.List;
import java.util.stream.Collectors;

public class BoardMapper {

    public static BoardDTO toDTO(Board board) {
        if (board == null) {
            return null;
        }
        BoardDTO boardDTO = new BoardDTO();
        boardDTO.setId(board.getId());
        boardDTO.setName(board.getName());
        if (board.getColumns() != null) {
            List<ColumnDTO> columnDTOs = board.getColumns().stream()
                    .map(ColumnMapper::toDTO)
                    .collect(Collectors.toList());
            boardDTO.setColumns(columnDTOs);
        }
        return boardDTO;
    }

    public static Board toEntity(BoardDTO boardDTO) {
        if (boardDTO == null) {
            return null;
        }
        Board board = new Board();
        board.setId(boardDTO.getId());
        board.setName(boardDTO.getName());
        if (boardDTO.getColumns() != null) {
            List<Column> columns = boardDTO.getColumns().stream()
                    .map(ColumnMapper::toEntity)
                    .collect(Collectors.toList());
            board.setColumns(columns);
        }
        return board;
    }
}
