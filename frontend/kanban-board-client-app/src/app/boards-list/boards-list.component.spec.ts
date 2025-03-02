// boards-list.component.spec.ts
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AuthService } from '../core/api/auth.service';
import { BoardService } from '../core/api/board.service';
import { BoardsListComponent } from './boards-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';

describe('BoardsListComponent', () => {
  let component: BoardsListComponent;
  let fixture: ComponentFixture<BoardsListComponent>;
  let mockBoardService: jasmine.SpyObj<BoardService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockBoardService = jasmine.createSpyObj('BoardService', [
      'getAllBoards',
      'deleteBoard',
      'createRandomBoard',
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', {
      isAuthenticated: of(true),
      hasRole: of(false),
      getBoardRoles: of(['READER']),
    });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatButtonModule,
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
    mockBoardService.getAllBoards.and.returnValue(
      of([{ id: 1, name: 'Test Board', columns: [] }]),
    );

    fixture.detectChanges();
  });

  it('should load boards on initialization', fakeAsync(() => {
    // component.ngOnInit();
    tick();

    expect(mockBoardService.getAllBoards).toHaveBeenCalled();
    expect(component.loading()).toBeFalse();
  }));

  it('should delete board and refresh list', fakeAsync(() => {
    const boardId = 1;
    mockBoardService.deleteBoard.and.returnValue(of(undefined));

    component.deleteBoard(boardId);
    tick();

    expect(mockBoardService.deleteBoard).toHaveBeenCalledWith(boardId);
    expect(mockBoardService.getAllBoards).toHaveBeenCalledTimes(2); // Initial load + after delete
  }));
});
