package com.kanban.board.interfaces.rest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kanban.board.domain.model.Board;
import com.kanban.board.domain.model.BoardColumn;
import com.kanban.board.domain.repository.BoardRepository;
import com.kanban.board.interfaces.rest.BoardController;
import com.kanban.board.interfaces.rest.BoardDTO;
import com.kanban.task.domain.model.Task;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BoardControllerTest {

    @Mock
    private BoardRepository boardRepository;

    @InjectMocks
    private BoardController boardController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


} 