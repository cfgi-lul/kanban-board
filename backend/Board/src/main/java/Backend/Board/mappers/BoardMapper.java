package Backend.Board.mappers;

import Backend.Board.dto.BoardDTO;
import Backend.Board.dto.ColumnDTO;
import Backend.Board.dto.LabelDTO;
import Backend.Board.mappers.ColumnMapper;
import Backend.Board.mappers.UserMapper;
import Backend.Board.model.Board;
import Backend.Board.model.BoardColumn;
import Backend.Board.model.Label;
import java.util.List;
import java.util.stream.Collectors;

public class BoardMapper {

    public static BoardDTO toDTO(Board board) {
        if (board == null) {
            return null;
        }
        
        List<ColumnDTO> columnDTOs = null;
        if (board.getColumns() != null) {
            columnDTOs = board.getColumns().stream()
                    .map(ColumnMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        List<LabelDTO> labelDTOs = null;
        if (board.getLabels() != null) {
            labelDTOs = board.getLabels().stream()
                    .map(LabelMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        return new BoardDTO(
            board.getId(),
            board.getName(),
            board.getDescription(),
            board.getSettings(),
            board.getInvitationCode(),
            board.isArchived(),
            board.getCreatedAt(),
            board.getUpdatedAt(),
            UserMapper.toDTO(board.getCreatedBy()),
            columnDTOs,
            labelDTOs
        );
    }

    public static BoardDTO toPreviewDTO(Board board) {
        if (board == null) {
            return null;
        }
        return new BoardDTO(board.getId(), board.getName(), board.isArchived());
    }

    public static Board toEntity(BoardDTO boardDTO) {
        if (boardDTO == null) {
            return null;
        }
        
        Board board = new Board();
        board.setId(boardDTO.getId());
        board.setName(boardDTO.getName());
        board.setDescription(boardDTO.getDescription());
        board.setSettings(boardDTO.getSettings());
        board.setInvitationCode(boardDTO.getInvitationCode());
        board.setArchived(boardDTO.isArchived());
        board.setCreatedAt(boardDTO.getCreatedAt());
        board.setUpdatedAt(boardDTO.getUpdatedAt());
        board.setCreatedBy(UserMapper.toEntity(boardDTO.getCreatedBy()));
        
        if (boardDTO.getColumns() != null) {
            List<BoardColumn> columns = boardDTO.getColumns().stream()
                    .map(columnDTO -> {
                        BoardColumn column = ColumnMapper.toEntity(columnDTO);
                        column.setBoard(board);
                        return column;
                    })
                    .collect(Collectors.toList());
            board.setColumns(columns);
        }
        
        if (boardDTO.getLabels() != null) {
            List<Label> labels = boardDTO.getLabels().stream()
                    .map(LabelMapper::toEntity)
                    .collect(Collectors.toList());
            board.setLabels(labels);
        }
        
        return board;
    }
}
