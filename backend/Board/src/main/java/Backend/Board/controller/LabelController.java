package Backend.Board.controller;

import Backend.Board.dto.LabelDTO;
import Backend.Board.exception.ResourceNotFoundException;
import Backend.Board.mappers.LabelMapper;
import Backend.Board.model.Board;
import Backend.Board.model.Label;
import Backend.Board.repository.BoardRepository;
import Backend.Board.repository.LabelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/labels")
public class LabelController {

    @Autowired
    private LabelRepository labelRepository;

    @Autowired
    private BoardRepository boardRepository;

    @GetMapping("/board/{boardId}")
    public ResponseEntity<List<LabelDTO>> getLabelsByBoard(@PathVariable Long boardId) {
        List<Label> labels = labelRepository.findByBoardIdOrderByCreatedAtDesc(boardId);
        List<LabelDTO> labelDTOs = labels.stream()
                .map(LabelMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(labelDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabelDTO> getLabelById(@PathVariable Long id) {
        return labelRepository.findById(id)
                .map(LabelMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LabelDTO> createLabel(@RequestBody LabelDTO labelDTO,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        // Validate the label data
        if (labelDTO.getName() == null || labelDTO.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (labelDTO.getColor() == null || labelDTO.getColor().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (labelDTO.getBoardId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Check if board exists
        Board board = boardRepository.findById(labelDTO.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        // Check if label with same name already exists in this board
        if (labelRepository.existsByNameAndBoardId(labelDTO.getName(), labelDTO.getBoardId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(null); // Label with this name already exists
        }

        Label label = LabelMapper.toEntity(labelDTO);
        label.setBoard(board);

        Label savedLabel = labelRepository.save(label);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(LabelMapper.toDTO(savedLabel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabelDTO> updateLabel(@PathVariable Long id,
                                               @RequestBody LabelDTO labelDTO) {
        // Validate the label data
        if (labelDTO.getName() == null || labelDTO.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (labelDTO.getColor() == null || labelDTO.getColor().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return labelRepository.findById(id)
                .map(label -> {
                    // Check if new name conflicts with existing label in same board
                    if (!label.getName().equals(labelDTO.getName()) &&
                            labelRepository.existsByNameAndBoardId(labelDTO.getName(), label.getBoard().getId())) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).<LabelDTO>build();
                    }

                    label.setName(labelDTO.getName());
                    label.setColor(labelDTO.getColor());
                    label.setDescription(labelDTO.getDescription());

                    Label savedLabel = labelRepository.save(label);
                    return ResponseEntity.ok(LabelMapper.toDTO(savedLabel));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabel(@PathVariable Long id) {
        return labelRepository.findById(id)
                .map(label -> {
                    labelRepository.delete(label);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
} 