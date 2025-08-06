package com.kanban.shared.infrastructure;

import com.kanban.shared.interfaces.rest.LabelDTO;
import com.kanban.shared.domain.model.Label;



public class LabelMapper {
    public static LabelDTO toDTO(Label label) {
        if (label == null) {
            return null;
        }
        
        return new LabelDTO(
            label.getId(),
            label.getName(),
            label.getColor(),
            label.getDescription(),
            label.getBoard() != null ? label.getBoard().getId() : null,
            label.getCreatedAt(),
            label.getUpdatedAt()
        );
    }

    public static LabelDTO toPreviewDTO(Label label) {
        if (label == null) {
            return null;
        }
        return new LabelDTO(label.getId(), label.getName(), label.getColor());
    }

    public static Label toEntity(LabelDTO labelDTO) {
        if (labelDTO == null) {
            return null;
        }
        
        Label label = new Label();
        label.setId(labelDTO.getId());
        label.setName(labelDTO.getName());
        label.setColor(labelDTO.getColor());
        label.setDescription(labelDTO.getDescription());
        label.setCreatedAt(labelDTO.getCreatedAt());
        label.setUpdatedAt(labelDTO.getUpdatedAt());
        // Board should be set in service layer
        return label;
    }
} 
