import {
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
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
import { TaksPreviewComponent } from './components/taks-preview/taks-preview.component';
import { TaskInstance } from '../core/models/classes/TaskInstance';
import { TaskPreviewInstance } from '../core/models/classes/TaskPreviewInstance';
import { TaskEditorComponent } from './components/task-editor/task-editor.component';
import { TaskService } from './../core/api/task.service';
import { TranslateModule } from '@ngx-translate/core';

interface BoardState {
  board: BoardInstance;
  loading: boolean;
  error: string | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kn-board',
  imports: [
    TaksPreviewComponent,
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
})
export class BoardComponent implements OnInit, OnDestroy {
  boardState$: Observable<BoardState>;
  private destroy$ = new Subject<void>();

  constructor(
    private boardService: BoardService,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
    private taskService: TaskService,
    private boardSocketService: BoardSocketService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeBoard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.boardSocketService.disconnect();
  }

  public initializeBoard(): void {
    const boardId$ = this.activatedRoute.params.pipe(
      map(params => params['id']),
      takeUntil(this.destroy$)
    );

    const initialBoard$ = boardId$.pipe(
      switchMap(boardId =>
        this.boardService.getBoardById(boardId).pipe(
          map(board => ({ board, loading: false, error: null })),
          catchError(_error => {
            // console.error('Error loading board:', _error);
            return of({
              board: null as unknown,
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
          map(board => ({ board, loading: false, error: null })),
          catchError(_error => {
            // console.error('WebSocket error:', _error);
            return of(null);
          })
        );
      })
    );

    this.boardState$ = merge(
      initialBoard$,
      socketUpdates$.pipe(
        filter(state => state !== null),
        tap(() => {
          // Board updated via WebSocket
        })
      )
    ).pipe(takeUntil(this.destroy$));
  }

  async onDrop(
    event: CdkDragDrop<TaskPreviewInstance[]>,
    currentBoard: BoardInstance
  ): Promise<void> {
    try {
      const { previousContainer, container, previousIndex, currentIndex } =
        event;

      if (previousContainer === container) {
        moveItemInArray(container.data, previousIndex, currentIndex);
      } else {
        transferArrayItem(
          previousContainer.data,
          container.data,
          previousIndex,
          currentIndex
        );
      }

      // Update task position in backend
      const movedTaskPreview = container.data[currentIndex];
      if (movedTaskPreview?.id) {
        // Get the full task first, then update it
        const fullTask = await firstValueFrom(
          this.taskService.getTasksByID(movedTaskPreview.id)
        );
        if (fullTask) {
          await firstValueFrom(this.taskService.updateTask(fullTask));
        }
      }

      // Send update via WebSocket
      this.boardSocketService.sendUpdate(
        currentBoard.id.toString(),
        currentBoard
      );

      this.showSuccessMessage('board.taskMovedSuccessfully');
    } catch {
      // console.error('Error moving task:', error);
      this.showErrorMessage('board.failedToMoveTask');
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

      const dialogRef = this.matDialog.open(TaskEditorComponent, {
        data: { task },
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
}
