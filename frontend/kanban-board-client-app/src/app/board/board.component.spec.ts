import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { BoardService } from '../core/api/board.service';
import { TaskService } from '../core/api/task.service';
import { BoardSocketService } from '../core/api/board-socket.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { of, throwError } from 'rxjs';
import { BoardInstance } from '../core/models/classes/BoardInstance';
import { TaskInstance } from '../core/models/classes/TaskInstance';
import { TaskEditorComponent } from './components/task-editor/task-editor.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let boardService: any;
  let taskService: any;
  let boardSocketService: any;
  let activatedRoute: any;
  let matDialog: any;
  let matSnackBar: any;

  const mockBoard: BoardInstance = {
    id: 1,
    name: 'Test Board',
    description: 'Test Description',
    invitationCode: 'TEST-123',
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: {
      id: 1,
      username: 'testuser',
      displayName: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enabled: true,
      name: 'Test User',
      roles: [{ id: 1, name: 'USER' }]
    },
    columns: [
      {
        id: 1,
        name: 'To Do',
        orderIndex: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: [
          {
            id: 1,
            title: 'Task 1',
            description: 'Description 1',
            priority: 'MEDIUM',
            status: 'TODO',
            dueDate: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            position: 0,
            createdBy: null,
            assignee: null,
            comments: [],
            attachments: [],
            labels: []
          },
          {
            id: 2,
            title: 'Task 2',
            description: 'Description 2',
            priority: 'HIGH',
            status: 'TODO',
            dueDate: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            position: 10,
            createdBy: null,
            assignee: null,
            comments: [],
            attachments: [],
            labels: []
          }
        ]
      },
      {
        id: 2,
        name: 'In Progress',
        orderIndex: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: []
      }
    ],
    labels: []
  };

  beforeEach(async () => {
    const boardServiceSpy = {
      getBoardById: jest.fn()
    };
    const taskServiceSpy = {
      getTasksByID: jest.fn()
    };
    const boardSocketServiceSpy = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      sendTaskMove: jest.fn(),
      listenForUpdates: jest.fn()
    };
    const matDialogSpy = {
      open: jest.fn()
    };
    const matSnackBarSpy = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        BoardComponent,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: BoardService, useValue: boardServiceSpy },
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: BoardSocketService, useValue: boardSocketServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy }
      ]
    }).compileComponents();

    boardService = TestBed.inject(BoardService) as any;
    taskService = TestBed.inject(TaskService) as any;
    boardSocketService = TestBed.inject(BoardSocketService) as any;
    activatedRoute = TestBed.inject(ActivatedRoute);
    matDialog = TestBed.inject(MatDialog) as any;
    matSnackBar = TestBed.inject(MatSnackBar) as any;

    // Setup default spy behaviors
    boardService.getBoardById.mockReturnValue(of(mockBoard));
    boardSocketService.listenForUpdates.mockReturnValue(of(mockBoard));
    boardSocketService.connect.mockResolvedValue(undefined);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize board on ngOnInit', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(boardService.getBoardById).toHaveBeenCalledWith('1');
      expect(boardSocketService.connect).toHaveBeenCalledWith('1');
      expect(component.boardState$).toBeDefined();
    }));

    it('should handle board loading error', fakeAsync(() => {
      const error = new Error('Board not found');
      boardService.getBoardById.mockReturnValue(throwError(() => error));

      component.ngOnInit();
      tick();

      expect(component.boardState$).toBeDefined();
    }));

    it('should disconnect WebSocket on destroy', () => {
      component.ngOnDestroy();
      expect(boardSocketService.disconnect).toHaveBeenCalled();
    });
  });

  describe('Drag and Drop', () => {
    it('should handle valid drag and drop operation', fakeAsync(() => {
      component.ngOnInit();
      tick();

      const mockEvent = {
        previousContainer: { id: '1', data: [...mockBoard.columns![0].tasks] },
        container: { id: '1', data: [...mockBoard.columns![0].tasks] },
        previousIndex: 0,
        currentIndex: 1,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      } as CdkDragDrop<TaskInstance[]>;

      component.onDrop(mockEvent, mockBoard);
      tick();

      expect(boardSocketService.sendTaskMove).toHaveBeenCalled();
      expect(matSnackBar.open).toHaveBeenCalled();
    }));

    it('should not send WebSocket event when task is dropped in same position', fakeAsync(() => {
      component.ngOnInit();
      tick();

      const mockEvent = {
        previousContainer: { id: '1', data: [...mockBoard.columns![0].tasks] },
        container: { id: '1', data: [...mockBoard.columns![0].tasks] },
        previousIndex: 0,
        currentIndex: 0, // Same position
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      } as CdkDragDrop<TaskInstance[]>;

      component.onDrop(mockEvent, mockBoard);
      tick();

      expect(boardSocketService.sendTaskMove).not.toHaveBeenCalled();
      expect(matSnackBar.open).not.toHaveBeenCalled();
    }));

    it('should handle cross-column drag and drop', fakeAsync(() => {
      component.ngOnInit();
      tick();

      const mockEvent = {
        previousContainer: { id: '1', data: [...mockBoard.columns![0].tasks] },
        container: { id: '2', data: [...mockBoard.columns![1].tasks] },
        previousIndex: 0,
        currentIndex: 0,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      } as CdkDragDrop<TaskInstance[]>;

      component.onDrop(mockEvent, mockBoard);
      tick();

      expect(boardSocketService.sendTaskMove).toHaveBeenCalled();
      expect(matSnackBar.open).toHaveBeenCalled();
    }));
  });

  describe('Task Management', () => {
    it('should open task editor dialog', fakeAsync(() => {
      const mockTask = mockBoard.columns![0].tasks[0];
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      matDialog.open.mockReturnValue(mockDialogRef as any);

      component.editTask(1);
      tick();

      expect(taskService.getTasksByID).toHaveBeenCalledWith(1);
      expect(matDialog.open).toHaveBeenCalledWith(
        TaskEditorComponent,
        jasmine.objectContaining({
          data: { task: mockTask },
          width: '800px',
          maxWidth: '90vw',
          disableClose: false
        })
      );
    }));

    it('should handle task editor error', fakeAsync(() => {
      taskService.getTasksByID.mockReturnValue(throwError(() => new Error('Task not found')));

      component.editTask(999);
      tick();

      expect(matSnackBar.open).toHaveBeenCalledWith(
        jasmine.any(String),
        jasmine.any(String),
        jasmine.any(Object)
      );
    }));
  });

  describe('WebSocket Communication', () => {
    it('should handle WebSocket updates', fakeAsync(() => {
      const updatedBoard = { ...mockBoard, name: 'Updated Board' };
      boardSocketService.listenForUpdates.and.returnValue(of(updatedBoard));

      component.ngOnInit();
      tick();

      expect(boardSocketService.listenForUpdates).toHaveBeenCalled();
    }));

    it('should handle WebSocket connection error', fakeAsync(() => {
      boardSocketService.connect.and.rejectWith(new Error('Connection failed'));

      component.ngOnInit();
      tick();

      expect(boardSocketService.connect).toHaveBeenCalledWith('1');
    }));
  });

  describe('Error Handling', () => {
    it('should show success message', () => {
      component['showSuccessMessage']('test.success');
      
      expect(matSnackBar.open).toHaveBeenCalledWith(
        jasmine.any(String),
        jasmine.any(String),
        jasmine.objectContaining({
          duration: 3000,
          panelClass: ['success-snackbar']
        })
      );
    });

    it('should show error message', () => {
      component['showErrorMessage']('test.error');
      
      expect(matSnackBar.open).toHaveBeenCalledWith(
        jasmine.any(String),
        jasmine.any(String),
        jasmine.objectContaining({
          duration: 5000,
          panelClass: ['error-snackbar']
        })
      );
    });
  });

  describe('Board State', () => {
    it('should have initial loading state', () => {
      expect(component.boardState$).toBeDefined();
    });

    it('should handle board state updates', fakeAsync(() => {
      component.ngOnInit();
      tick();

      let currentState: any;
      component.boardState$.subscribe(state => {
        currentState = state;
      });
      tick();

      expect(currentState).toBeDefined();
      expect(currentState.board).toBeDefined();
      expect(currentState.loading).toBe(false);
      expect(currentState.error).toBeNull();
    }));
  });
}); 