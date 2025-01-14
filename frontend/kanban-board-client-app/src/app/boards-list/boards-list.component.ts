import { BehaviorSubject, switchMap, take, tap } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BoardService } from '../core/api/board.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-boards-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    AsyncPipe,
    RouterModule,
  ],
  templateUrl: './boards-list.component.html',
  styleUrl: './boards-list.component.scss',
})
export class BoardsListComponent {
  private refreshBoards$ = new BehaviorSubject<void>(null);
  private boardService = inject(BoardService);
  boards$ = this.refreshBoards$.pipe(
    tap(() => this.loading.set(true)),
    switchMap(() => this.boardService.getAllBoards()),
    tap(() => this.loading.set(false)),
  );
  loading = signal(true);

  constructor(private router: Router) {}

  addBoard(): void {
    this.boardService
      // .createBoard({
      //   name: 'string',
      //   columns: [],JsonManagedReference
      //   users: [],
      // })
      .createRandomBoard()
      .pipe(take(1))
      .subscribe(() => this.refreshBoards$.next());
  }

  openBoard(boardId: number): void {
    this.router.navigate(['/board', boardId]);
  }

  deleteBoard(boardId: number): void {
    this.boardService
      .deleteBoard(boardId)
      .pipe(take(1))
      .subscribe(() => this.refreshBoards$.next());
  }
}
