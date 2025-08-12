import { Component, inject, input, OnInit } from '@angular/core';
import { Observable, repeat, take } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CommentInstance } from '../../../core/models/classes/CommentInstance';
import { CommentService } from '../../../core/api/comment.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// Removed MatList/Divider in favor of custom layout
import { TranslateModule } from '@ngx-translate/core';
// Removed user display and mentions parsing for streamlined chat UI

const COMMENTS_UPDATE_TIMEOUT_S = 5 * 1_000;

@Component({
  selector: 'kn-task-comments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    DatePipe,
    TranslateModule,
  ],
  templateUrl: './task-comments.component.html',
  styleUrl: './task-comments.component.scss',
})
export class TaskCommentsComponent implements OnInit {
  private commentService = inject(CommentService);

  taskId = input.required<number>();

  commentControl = new FormControl('', { nonNullable: true });
  comments$!: Observable<CommentInstance[]>;

  constructor() {}

  ngOnInit(): void {
    const taskId = this.taskId();
    if (taskId) {
      this.comments$ = this.commentService
        .getComments(taskId)
        .pipe(repeat({ delay: COMMENTS_UPDATE_TIMEOUT_S }));
    }
  }

  addComment(): void {
    const raw = this.commentControl.value;
    const value = (raw ?? '').trim();
    const taskId = this.taskId();
    if (value && taskId) {
      this.commentService
        .createComment({
          content: value,
          taskId: taskId,
        })
        .pipe(take(1))
        .subscribe(() => {
          this.commentControl.setValue('');
        });
    }
  }

  removeComment(comment: CommentInstance): void {
    console.log('Remove comment:', comment.id);
  }
}
