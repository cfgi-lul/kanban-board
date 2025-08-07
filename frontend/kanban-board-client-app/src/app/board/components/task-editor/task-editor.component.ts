import { Component, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { firstValueFrom, Observable, repeat, take } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MarkdownComponent, MarkdownModule } from 'ngx-markdown';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CommentInstance } from './../../../core/models/classes/CommentInstance';
import { CommentService } from '../../../core/api/comment.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TaskInstance } from '../../../core/models/classes/TaskInstance';
import { TaskService } from '../../../core/api/task.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TranslateModule } from '@ngx-translate/core';

const COMMENTS_UPDATE_TIMEOUT_S = 5 * 1_000;
@Component({
  selector: 'kn-task-editor',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    AsyncPipe,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule,
    MarkdownComponent,
    MarkdownModule,
    TextFieldModule,
    TranslateModule,
  ],
  templateUrl: './task-editor.component.html',
  styleUrl: './task-editor.component.scss',
})
export class TaskEditorComponent {
  taskForm: FormGroup;
  isEditDescription = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  comments$: Observable<CommentInstance[]>;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private commentService: CommentService,
    public dialogRef: MatDialogRef<TaskEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: TaskInstance }
  ) {
    this.taskForm = this.fb.group({
      title: [data.task.title, Validators.required],
      description: [data.task.description],
      newComment: [''],
    });

    this.comments$ = this.commentService
      .getComments(data.task.id)
      .pipe(repeat({ delay: COMMENTS_UPDATE_TIMEOUT_S }));
  }

  onClearTitle(): void {
    this.taskForm.get('title')?.setValue('');
  }

  toggleEditDescription(): void {
    this.isEditDescription = !this.isEditDescription;
  }

  addComment(): void {
    const value = this.taskForm.value.newComment.trim();
    if (value) {
      this.commentService
        .createComment({
          content: value,
          taskId: this.data.task.id,
        })
        .pipe(take(1))
        .subscribe();
      this.taskForm.get('newComment')?.setValue('');
    }
  }

  removeComment(comment: CommentInstance): void {
    this.data.task.comments = this.data.task.comments.filter(
      c => c.id !== comment.id
    );
  }

  async onSave(): Promise<void> {
    if (this.taskForm.valid) {
      const updatedTask: TaskInstance = {
        ...this.data.task,
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
      };
      await firstValueFrom(this.taskService.updateTask(updatedTask));
      this.dialogRef.close(updatedTask);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
