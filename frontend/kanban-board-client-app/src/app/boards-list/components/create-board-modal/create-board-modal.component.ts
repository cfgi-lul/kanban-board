import { Component, inject, signal } from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { BoardService } from "../../../core/api/board.service";
import { BoardInstance } from "../../../core/models/classes/BoardInstance";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BoardDTO } from "../../../core/models/requestModels/model/boardDTO";

interface BoardColumn {
  name: string;
  orderIndex: number;
  color: string | null;
  taskLimit: number | null;
}

interface CreateBoardPayload {
  name: string;
  description: string;
  columns: BoardColumn[];
}

export interface CreateBoardData {
  name: string;
  description?: string;
  columns?: string[];
}

@Component({
  selector: "kn-create-board-modal",
  imports: [
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
    MatToolbarModule
],
  templateUrl: "./create-board-modal.component.html",
  styleUrl: "./create-board-modal.component.scss",
})
export class CreateBoardModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly boardService = inject(BoardService);
  private readonly dialogRef = inject(MatDialogRef<CreateBoardModalComponent>);
  private readonly data = inject(MAT_DIALOG_DATA, { optional: true });
  private readonly translate = inject(TranslateService);

  readonly createBoardForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal("");

  constructor() {
    this.createBoardForm = this.initializeForm(this.data);
  }

  get columns() {
    return this.createBoardForm.get("columns") as FormArray;
  }

  addColumn(): void {
    if (this.columns.length < 10) {
      this.columns.push(this.fb.control("", Validators.required));
    }
  }

  removeColumn(index: number): void {
    if (this.columns.length > 1) {
      this.columns.removeAt(index);
    }
  }

  onSubmit(): void {
    if (!this.createBoardForm.valid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set("");

    const boardData = this.prepareBoardData();
    this.submitBoardData(boardData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private initializeForm(data: CreateBoardData): FormGroup {
    const defaultColumns = [
      this.translate.instant("board.defaultColumn.todo"),
      this.translate.instant("board.defaultColumn.inProgress"),
      this.translate.instant("board.defaultColumn.done"),
    ];

    const defaultName =
      data?.name || this.translate.instant("board.defaultColumn.name");
    const defaultDescription =
      data?.description ||
      this.translate.instant("board.defaultColumn.description");

    return this.fb.group({
      name: [
        defaultName,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: [defaultDescription, [Validators.maxLength(500)]],
      columns: this.fb.array(
        defaultColumns.map((col) => this.fb.control(col, Validators.required)),
      ),
    });
  }

  private prepareBoardData(): CreateBoardPayload {
    const formValue = this.createBoardForm.value;
    return {
      name: formValue.name,
      description: formValue.description || "",
      columns: formValue.columns
        .filter((col: string) => col.trim() !== "")
        .map((col: string, index: number) => ({
          name: col.trim(),
          orderIndex: index,
          color: null,
          taskLimit: null,
        })),
    };
  }

  private submitBoardData(boardData: CreateBoardPayload): void {
    this.boardService.createBoard(boardData as BoardDTO).subscribe({
      next: (board: BoardInstance) => {
        this.isLoading.set(false);
        this.dialogRef.close(board);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.handleError(error);
      },
    });
  }

  private handleError(error: any): void {
    if (error.status === 403 || error.status === 401) {
      this.errorMessage.set("board.authenticationRequired");
    } else {
      this.errorMessage.set(error.error?.message || "board.errorCreatingBoard");
    }
  }
}
