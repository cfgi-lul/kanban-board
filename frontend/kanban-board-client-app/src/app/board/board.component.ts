import {
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  firstValueFrom,
  map,
  merge,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import type { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Board } from '../core/models/classes/Board';
import { BoardService } from '../core/api/board.service';
import { BoardSocketService } from '../core/api/board-socket.service';
import type { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { TaksPreviewComponent } from './components/taks-preview/taks-preview.component';
import { Task } from '../core/models/classes/Task';
import { TaskEditorComponent } from './components/task-editor/task-editor.component';
import { TaskService } from './../core/api/task.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-board',
  imports: [
    TaksPreviewComponent,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  board$: Observable<Board>;
  boardId$: Observable<string>;
  private destroy$ = new Subject<void>();

  constructor(
    private boardService: BoardService,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
    private taskService: TaskService,
    private boardSocketService: BoardSocketService
  ) {
    this.boardId$ = this.activatedRoute.params.pipe(
      map(params => params['id'])
    );
  }

  ngOnInit(): void {
    const initialBoard$ = this.boardId$.pipe(
      switchMap(boardId => this.boardService.getBoardById(boardId))
    );

    const socketUpdates$ = this.boardId$.pipe(
      switchMap(boardId => {
        this.boardSocketService.connect(boardId);
        return this.boardSocketService.listenForUpdates();
      })
    );

    this.board$ = merge(
      initialBoard$,
      socketUpdates$.pipe(tap(e => console.log(e)))
    ).pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.boardSocketService.disconnect();
  }

  async drop(event: CdkDragDrop<Task[]>, currentBoard: Board): Promise<void> {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.boardSocketService.sendUpdate(
      currentBoard.id.toString(),
      currentBoard
    );
  }

  async editTask(id: number): Promise<void> {
    const task = await firstValueFrom(this.taskService.getTasksByID(id));

    this.matDialog.open(TaskEditorComponent, {
      data: { task },
      width: '800px',
    });
  }

  deliteTask(id: number): void {
    console.log('deliteTask', id);
    this.taskService.deleteTask(id).pipe(take(1)).subscribe();
  }

  createTask(boardId: string, columnId: string): void {
    this.taskService
      .createTask(
        new Task({
          // id?: number;
          title: 'новая задача',
          description: 'описание',
          comments: [],
        }),
        boardId,
        columnId
      )
      .pipe(take(1))
      .subscribe();
  }
}
