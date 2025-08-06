package com.kanban.board.interfaces.rest;

import com.kanban.shared.domain.exception.ResourceNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kanban.shared.infrastructure.ColumnMapper;
import com.kanban.board.domain.model.BoardColumn;
import com.kanban.board.domain.repository.ColumnRepository;





@RestController
@RequestMapping("/columns")
public class ColumnController {

    @Autowired
    private ColumnRepository columnRepository;

    @GetMapping
    public List<ColumnDTO> getAllColumns(@RequestParam(required = false) Long id) {
        List<BoardColumn> columns;
        if (id != null) {
            columns = columnRepository.findById(id).map(List::of)
                    .orElseThrow(() -> new ResourceNotFoundException("Column not found"));
        } else {
            columns = columnRepository.findAll();
        }
        return columns.stream()
                .map(ColumnMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ColumnDTO> createColumn(@RequestBody ColumnDTO columnDTO) {
        // Validate the column name
        if (columnDTO.getName() == null || columnDTO.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        BoardColumn column = ColumnMapper.toEntity(columnDTO);
        BoardColumn savedColumn = columnRepository.save(column);
        return ResponseEntity.status(HttpStatus.CREATED).body(ColumnMapper.toDTO(savedColumn));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ColumnDTO> updateColumn(@PathVariable Long id, @RequestBody ColumnDTO columnDTO) {
        // Validate the column name
        if (columnDTO.getName() == null || columnDTO.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return columnRepository.findById(id)
                .map(column -> {
                    // Update column fields from DTO
                    column.setName(columnDTO.getName());
                    column.setOrderIndex(columnDTO.getOrderIndex());
                    column.setColor(columnDTO.getColor());
                    column.setTaskLimit(columnDTO.getTaskLimit());
                    
                    BoardColumn savedColumn = columnRepository.save(column);
                    return ResponseEntity.ok(ColumnMapper.toDTO(savedColumn));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable Long id) {
        return columnRepository.findById(id)
                .map(column -> {
                    columnRepository.delete(column);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
