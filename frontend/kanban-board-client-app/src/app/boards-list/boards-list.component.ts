import {
  BehaviorSubject,
  map,
  Observable,
  switchMap,
  take,
  tap,
  catchError,
  of,
} from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';

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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../core/api/auth.service';
import { Board } from '../core/models/classes/Board';

export type LoadingState = 'loading' | 'error' | 'fulfilled';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-boards-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    AsyncPipe,
    RouterModule,
  ],
  templateUrl: './boards-list.component.html',
  styleUrl: './boards-list.component.scss',
})
export class BoardsListComponent implements OnInit, OnDestroy {
  private refreshBoards$ = new BehaviorSubject<void>(null);
  private boardService = inject(BoardService);

  // State management
  loadingState = signal<LoadingState>('loading');
  allBoards = signal<Board[]>([]);
  searchTerm = signal('');

  // Computed filtered boards
  filteredBoards = computed(() => {
    const boards = this.allBoards();
    const search = this.searchTerm().toLowerCase().trim();

    if (!search) {
      return boards;
    }

    return boards.filter(board => board.name.toLowerCase().includes(search));
  });

  // Loading state observables
  isLoading = computed(() => this.loadingState() === 'loading');
  hasError = computed(() => this.loadingState() === 'error');
  isFulfilled = computed(() => this.loadingState() === 'fulfilled');

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBoards();
  }

  ngOnDestroy(): void {
    this.refreshBoards$.complete();
  }

  private loadBoards(): void {
    this.loadingState.set('loading');

    this.refreshBoards$.pipe(
      switchMap(() => this.boardService.getAllBoards()),
      tap(boards => {
        this.allBoards.set(boards);
        this.loadingState.set('fulfilled');
      }),
      catchError(error => {
        console.error('Error loading boards:', error);
        this.loadingState.set('error');
        return of([]);
      })
    ).subscribe();
  }

  canDelete(boardId: number): Observable<boolean> {
    return this.authService
      .getBoardRoles(boardId)
      .pipe(map(e => e.includes('ADMIN')));
  }

  addBoard(): void {
    this.boardService
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

  retryLoad(): void {
    this.loadBoards();
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }
}
