// board.service.spec.ts
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BoardService } from './board.service';
import { TestBed } from '@angular/core/testing';
import { Board } from '../models/classes/Board';

describe('BoardService', () => {
  let service: BoardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BoardService],
    });
    service = TestBed.inject(BoardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // board.service.spec.ts
  it('should fetch all boards', () => {
    const mockBoards = [new Board({ id: 1, name: 'Test Board' })];

    service.getAllBoards().subscribe((boards) => {
      expect(boards.length).toBe(1);
      expect(boards).toEqual(mockBoards);
    });

    const req = httpMock.expectOne('/api/boards');
    expect(req.request.method).toBe('GET');
    req.flush(mockBoards);
  });

  it('should create a random board', () => {
    const mockBoard = new Board({ id: 1, name: 'Random Board' });

    service.createRandomBoard().subscribe((board) => {
      expect(board).toEqual(mockBoard);
    });

    const req = httpMock.expectOne('/api/boards/random');
    expect(req.request.method).toBe('POST');
    req.flush(mockBoard);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
