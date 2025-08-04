package Backend.Board.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import Backend.Board.model.Column;
import Backend.Board.repository.ColumnRepository;

@RestController
@RequestMapping("/columns")
public class ColumnController {

    @Autowired
    private ColumnRepository columnRepository;

    @GetMapping
    public List<Column> getAllColumns(@RequestParam(required = false) Long id) {
        if (id != null) {
            return columnRepository.findById(id).map(List::of)
                    .orElseThrow(() -> new RuntimeException("Column not found"));
        }
        return columnRepository.findAll();
    }

    @PostMapping
    public Column createColumn(@RequestBody Column column) {
        return columnRepository.save(column);
    }

    @DeleteMapping
    public void deleteColumn(@RequestParam Long id) {
        columnRepository.deleteById(id);
    }
}
