import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  catchError,
  firstValueFrom,
  map,
  merge,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  filter,
  BehaviorSubject,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BoardInstance } from '../core/models/classes/BoardInstance';
import { BoardService } from '../core/api/board.service';
import { BoardSocketService } from '../core/api/board-socket.service';
import type { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { TaskPreviewComponent } from './components/task-preview/task-preview.component';
import { TaskInstance } from '../core/models/classes/TaskInstance';
import { TaskEditorComponent } from './components/task-editor/task-editor.component';
import { TaskService } from './../core/api/task.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  handleDragDrop,
  isValidDragDrop,
  TaskMoveData,
} from '../core/utils/drag-drop.utils';
import { ensureTaskPositions } from '../core/utils/task-position.utils';

interface BoardState {
  board: BoardInstance | null;
  loading: boolean;
  error: string | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kn-board',
  imports: [
    TaskPreviewComponent,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  // encapsulation: ViewEncapsulation.None,
})
export class BoardComponent implements OnInit, OnDestroy {
  private boardService = inject(BoardService);
  private activatedRoute = inject(ActivatedRoute);
  private matDialog = inject(MatDialog);
  private taskService = inject(TaskService);
  private boardSocketService = inject(BoardSocketService);
  private snackBar = inject(MatSnackBar);

  boardState$: Observable<BoardState>;
  private boardStateSubject = new BehaviorSubject<BoardState | null>(null);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Set up the boardState$ to use the BehaviorSubject
    this.boardState$ = this.boardStateSubject.asObservable().pipe(
      filter((state): state is BoardState => state !== null),
      takeUntil(this.destroy$)
    );

    // Initialize the board data
    this.initializeBoard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.boardSocketService.disconnect();
  }

  public initializeBoard(): void {
    // Set initial loading state
    this.boardStateSubject.next({
      board: null,
      loading: true,
      error: null,
    });

    const boardId$ = this.activatedRoute.params.pipe(
      map(params => params['id']),
      takeUntil(this.destroy$)
    );

    const initialBoard$ = boardId$.pipe(
      switchMap(boardId =>
        this.boardService.getBoardById(boardId).pipe(
          map(board => {
            // Ensure tasks have proper positions
            const boardWithPositions = ensureTaskPositions(board);
            return { board: boardWithPositions, loading: false, error: null };
          }),
          catchError(_error => {
            console.error('Error loading board:', _error);
            return of({
              board: null as any,
              loading: false,
              error: 'Failed to load board. Please try again.',
            });
          })
        )
      )
    );

    const socketUpdates$ = boardId$.pipe(
      switchMap(boardId => {
        this.boardSocketService.connect(boardId);
        return this.boardSocketService.listenForUpdates().pipe(
          map(board => {
            // Ensure tasks have proper positions after WebSocket updates
            const boardWithPositions = ensureTaskPositions(board);

            return { board: boardWithPositions, loading: false, error: null };
          }),
          catchError(error => {
            console.error('WebSocket error:', error);
            // Return error state instead of null to show connection issues
            return of({
              board: null as any,
              loading: false,
              error:
                'WebSocket connection failed. Board updates may not be real-time.',
            });
          })
        );
      })
    );

    // Merge initial board and WebSocket updates, then feed to BehaviorSubject
    merge(
      initialBoard$,
      socketUpdates$.pipe(
        filter(state => state !== null),
        tap(() => {
          // Board updated via WebSocket
        })
      )
    )
      .pipe(
        tap(state => {
          // Force sort tasks by position in all columns
          if (state.board?.columns) {
            state.board.columns.forEach(column => {
              if (column.tasks && column.tasks.length > 0) {
                column.tasks.sort(
                  (a, b) => (a.position ?? 0) - (b.position ?? 0)
                );
              }
            });
          }

          this.boardStateSubject.next(state);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  async onDrop(
    event: CdkDragDrop<TaskInstance[]>,
    currentBoard: BoardInstance
  ): Promise<void> {
    try {
      // Validate the drag and drop operation
      if (!isValidDragDrop(event)) {
        this.showErrorMessage('board.invalidDragDropOperation');
        return;
      }

      // Get the current state before applying optimistic update
      const currentState = this.boardStateSubject.value;
      if (!currentState || !currentState.board) {
        this.showErrorMessage('board.invalidBoardState');
        return;
      }

      // Handle the drag and drop operation using utility function
      const { updatedBoard, dragEvent, shouldSendEvent } = handleDragDrop(
        event,
        currentState.board
      );

      // Apply optimistic update immediately for better UX
      this.applyOptimisticUpdate(updatedBoard);

      // Only send WebSocket event if the task actually moved
      if (shouldSendEvent) {
        // Create task move message with proper format
        const taskMoveData: TaskMoveData = {
          type: 'TASK_MOVE',
          boardId: currentState.board.id!,
          userId: 'current-user', // TODO: Get from auth service
          taskId: dragEvent.taskId,
          previousColumnId: dragEvent.previousColumnId,
          currentColumnId: dragEvent.currentColumnId,
          previousIndex: dragEvent.previousIndex,
          currentIndex: dragEvent.currentIndex,
          timestamp: Date.now(),
        };

        // Send the task move event via WebSocket
        this.boardSocketService.sendTaskMove(
          currentState.board.id!.toString(),
          taskMoveData
        );

        this.showSuccessMessage('board.taskMovedSuccessfully');
      }
    } catch (error) {
      console.error('Error moving task:', error);
      this.showErrorMessage('board.failedToMoveTask');
      // Revert optimistic update on error
      this.revertOptimisticUpdate();
    }
  }

  async editTask(taskId: number): Promise<void> {
    try {
      const task = await firstValueFrom(
        this.taskService.getTasksByID(taskId).pipe(
          catchError(error => {
            // console.error('Error loading task:', error);
            this.showErrorMessage('board.failedToLoadTaskDetails');
            throw error;
          })
        )
      );

      // Get the current board ID from the route
      const boardId = await firstValueFrom(
        this.activatedRoute.params.pipe(map(params => params['id']))
      );

      const dialogRef = this.matDialog.open(TaskEditorComponent, {
        data: { task, boardId: parseInt(boardId) },
        width: '800px',
        maxWidth: '90vw',
        disableClose: false,
      });

      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) {
            this.showSuccessMessage('board.taskUpdatedSuccessfully');
          }
        });
    } catch {
      // console.error('Error opening task editor:', error);
    }
  }

  async deleteTask(taskId: number): Promise<void> {
    try {
      await firstValueFrom(
        this.taskService.deleteTask(taskId).pipe(
          catchError(error => {
            // console.error('Error deleting task:', error);
            this.showErrorMessage('board.failedToDeleteTask');
            throw error;
          })
        )
      );

      this.showSuccessMessage('board.taskDeletedSuccessfully');
    } catch {
      // console.error('Error deleting task:', error);
    }
  }

  async createTask(boardId: string, columnId: string): Promise<void> {
    try {
      const newTask = new TaskInstance({
        title: 'board.newTask',
        description: 'board.taskDescription',
        comments: [],
      });

      await firstValueFrom(
        this.taskService.createTask(newTask, boardId, columnId).pipe(
          catchError(error => {
            // console.error('Error creating task:', error);
            this.showErrorMessage('board.failedToCreateTask');
            throw error;
          })
        )
      );

      this.showSuccessMessage('board.taskCreatedSuccessfully');
    } catch {
      // console.error('Error creating task:', error);
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'common.close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'common.close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private applyOptimisticUpdate(updatedBoard: BoardInstance): void {
    const currentState = this.boardStateSubject.value;
    if (currentState) {
      // Ensure tasks have proper positions in optimistic update
      const boardWithPositions = ensureTaskPositions(updatedBoard);

      // Create a new state object to trigger change detection
      const optimisticState: BoardState = {
        ...currentState,
        board: boardWithPositions,
      };

      // Update the subject to trigger change detection
      this.boardStateSubject.next(optimisticState);

      // Force change detection with multiple updates to ensure it's applied
      setTimeout(() => {
        this.boardStateSubject.next(optimisticState);
      }, 0);

      setTimeout(() => {
        this.boardStateSubject.next(optimisticState);
      }, 50);

      // Additional update to ensure it sticks
      setTimeout(() => {
        this.boardStateSubject.next(optimisticState);
      }, 100);
    }
  }

  private revertOptimisticUpdate(): void {
    // The WebSocket will provide the correct state, so we don't need to manually revert
    // The optimistic update will be overwritten by the next WebSocket update
  }
}
