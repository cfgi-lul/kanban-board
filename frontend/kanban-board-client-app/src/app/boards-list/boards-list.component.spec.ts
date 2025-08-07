// boards-list.component.spec.ts
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { AuthService } from "../core/api/auth.service";
import { BoardService } from "../core/api/board.service";
import { BoardsListComponent } from "./boards-list.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";

describe("BoardsListComponent", () => {
  let component: BoardsListComponent;
  let fixture: ComponentFixture<BoardsListComponent>;
  let mockBoardService: jest.Mocked<BoardService>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockBoardService = {
      getAllBoards: jest.fn(),
      deleteBoard: jest.fn(),
      createRandomBoard: jest.fn(),
    } as unknown as jest.Mocked<BoardService>;

    mockAuthService = {
      isAuthenticated: jest.fn(),
      hasRole: jest.fn(),
      getBoardRoles: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    // Setup default return values
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.hasRole.mockReturnValue(false);
    mockAuthService.getBoardRoles.mockReturnValue(of(["READER"]));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatButtonModule,
        TranslateModule.forRoot(),
        BoardsListComponent,
      ],
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardsListComponent);
    component = fixture.componentInstance;

    // Mock initial board data
    mockBoardService.getAllBoards.mockReturnValue(
      of([{ id: 1, name: "Test Board", columns: [] }]),
    );

    fixture.detectChanges();
  });

  it("should load boards on initialization", fakeAsync(() => {
    tick();

    expect(mockBoardService.getAllBoards).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  }));

  it("should delete board and refresh list", fakeAsync(() => {
    const boardId = 1;
    mockBoardService.deleteBoard.mockReturnValue(of(undefined));

    component.deleteBoard(boardId);
    tick();

    expect(mockBoardService.deleteBoard).toHaveBeenCalledWith(boardId);
    expect(mockBoardService.getAllBoards).toHaveBeenCalled();
  }));
});
