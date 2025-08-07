import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { BoardService } from '../../core/api/board.service';
import { BoardInstance } from '../../core/models/classes/BoardInstance';

export interface CreateBoardData {
  name: string;
  description?: string;
  columns?: string[];
}

@Component({
  selector: 'kn-create-board-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './create-board-modal.component.html',
  styleUrl: './create-board-modal.component.scss',
})
export class CreateBoardModalComponent {
  private fb = inject(FormBuilder);
  private boardService = inject(BoardService);
  private dialogRef = inject(MatDialogRef<CreateBoardModalComponent>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });

  @Output() boardCreated = new EventEmitter<BoardInstance>();

  createBoardForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.createBoardForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: ['', [Validators.maxLength(500)]],
      columns: this.fb.array([
        this.fb.control('To Do', Validators.required),
        this.fb.control('In Progress', Validators.required),
        this.fb.control('Done', Validators.required),
      ]),
    });

    if (this.data) {
      this.createBoardForm.patchValue(this.data);
    }
  }

  get columns() {
    return this.createBoardForm.get('columns') as FormArray;
  }

  addColumn(): void {
    if (this.columns.length < 10) {
      this.columns.push(this.fb.control('', Validators.required));
    }
  }

  removeColumn(index: number): void {
    if (this.columns.length > 1) {
      this.columns.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.createBoardForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.createBoardForm.value;
      const boardData = {
        name: formValue.name,
        description: formValue.description || '',
        columns: formValue.columns
          .filter((col: string) => col.trim() !== '')
          .map((col: string, index: number) => ({
            name: col.trim(),
            orderIndex: index,
            color: null,
            taskLimit: null,
          })),
      };

      this.boardService.createBoard(boardData).subscribe({
        next: (board: BoardInstance) => {
          this.isLoading = false;
          this.boardCreated.emit(board);
          this.dialogRef.close(board);
        },
        error: error => {
          this.isLoading = false;
          if (error.status === 403 || error.status === 401) {
            this.errorMessage = 'board.authenticationRequired';
          } else {
            this.errorMessage =
              error.error?.message || 'board.errorCreatingBoard';
          }
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
