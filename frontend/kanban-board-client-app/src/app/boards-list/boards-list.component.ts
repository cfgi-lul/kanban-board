import {
  BehaviorSubject,
  map,
  Observable,
  switchMap,
  take,
  tap,
  catchError,
  of,
  shareReplay,
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../core/api/auth.service';
import { BoardInstance } from '../core/models/classes/BoardInstance';
import { TranslateModule } from '@ngx-translate/core';
import { CreateBoardModalComponent } from './create-board-modal/create-board-modal.component';

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
    MatDialogModule,
    AsyncPipe,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './boards-list.component.html',
  styleUrl: './boards-list.component.scss',
})
export class BoardsListComponent implements OnInit, OnDestroy {
  private refreshBoards$ = new BehaviorSubject<void>(null);
  private boardService = inject(BoardService);
  private boardRolesCache = new Map<number, Observable<boolean>>();

  // State management
  loadingState = signal<LoadingState>('loading');
  allBoards = signal<BoardInstance[]>([]);
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
    private dialog: MatDialog,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBoards();
  }

  ngOnDestroy(): void {
    this.refreshBoards$.complete();
    this.boardRolesCache.clear();
  }

  private loadBoards(): void {
    this.loadingState.set('loading');
    // Clear the cache when loading new boards
    this.boardRolesCache.clear();

    this.refreshBoards$
      .pipe(
        switchMap(() => this.boardService.getAllBoards()),
        tap(boards => {
          this.allBoards.set(boards);
          this.loadingState.set('fulfilled');
        }),
        catchError(_error => {
          // console.error('Error loading boards:', _error);
          this.loadingState.set('error');
          return of([]);
        })
      )
      .subscribe();
  }

  canDelete(boardId: number): Observable<boolean> {
    if (!this.boardRolesCache.has(boardId)) {
      const canDelete$ = this.authService.getBoardRoles(boardId).pipe(
        map(e => e?.includes('ADMIN') || false),
        shareReplay(1)
      );
      this.boardRolesCache.set(boardId, canDelete$);
    }
    return this.boardRolesCache.get(boardId)!;
  }

  addBoard(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      // Redirect to login page
      this.router.navigate(['/sign-in']);
      return;
    }

    const dialogRef = this.dialog.open(CreateBoardModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
      data: null,
    });

    dialogRef.afterClosed().subscribe((result: BoardInstance | undefined) => {
      if (result) {
        this.refreshBoards$.next();
      }
    });
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
