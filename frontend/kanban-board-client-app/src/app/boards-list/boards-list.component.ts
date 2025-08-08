import { BehaviorSubject, switchMap, tap, catchError, of } from 'rxjs';
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

import { AddBoardCardComponent } from './components/add-board-card/add-board-card.component';
import { ErrorDisplayComponent } from '../core/components/error-display/error-display.component';
import { NoContentComponent } from '../core/components/no-content/no-content.component';
import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { BoardCardComponent } from './components/board-card/board-card.component';

export type LoadingState = 'loading' | 'error' | 'fulfilled';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kn-boards-list',
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
    RouterModule,
    TranslateModule,
    BoardCardComponent,
    AddBoardCardComponent,
    ErrorDisplayComponent,
    NoContentComponent,
  ],
  templateUrl: './boards-list.component.html',
  styleUrl: './boards-list.component.scss',
})
export class BoardsListComponent implements OnInit, OnDestroy {
  protected refreshBoards$ = new BehaviorSubject<void>(undefined);
  private boardService = inject(BoardService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

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

  ngOnInit(): void {
    this.loadBoards();
  }

  ngOnDestroy(): void {
    this.refreshBoards$.complete();
  }

  private loadBoards(): void {
    this.loadingState.set('loading');

    this.refreshBoards$
      .pipe(
        switchMap(() => this.boardService.getAllBoards()),
        tap(boards => {
          this.allBoards.set(boards);
          this.loadingState.set('fulfilled');
        }),
        catchError(_error => {
          this.loadingState.set('error');
          return of([]);
        })
      )
      .subscribe();
  }

  retryLoad(): void {
    this.loadBoards();
  }

  openBoard(boardId: number): void {
    this.router.navigate(['/dashboard/board', boardId]);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  addBoard(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/sign-in']);
      return;
    }

    const dialogRef = this.dialog.open(CreateBoardModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result: BoardInstance | undefined) => {
      if (result) {
        this.refreshBoards$.next();
      }
    });
  }
}
