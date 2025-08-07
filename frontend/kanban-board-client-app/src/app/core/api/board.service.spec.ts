// board.service.spec.ts
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { BoardService } from "./board.service";
import { TestBed } from "@angular/core/testing";

describe("BoardService", () => {
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

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch all boards", () => {
    const mockBoardDTO = { id: 1, name: "Test Board", columns: [] };

    service.getAllBoards().subscribe((boards) => {
      expect(boards.length).toBe(1);
      expect(boards[0].id).toBe(1);
      expect(boards[0].name).toBe("Test Board");
    });

    const req = httpMock.expectOne("/api/boards");
    expect(req.request.method).toBe("GET");
    req.flush([mockBoardDTO]);
  });

  it("should create a random board", () => {
    const mockBoardDTO = { id: 1, name: "Random Board", columns: [] };

    service.createRandomBoard().subscribe((board) => {
      expect(board.id).toBe(1);
      expect(board.name).toBe("Random Board");
    });

    const req = httpMock.expectOne("/api/boards/random");
    expect(req.request.method).toBe("POST");
    req.flush(mockBoardDTO);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
