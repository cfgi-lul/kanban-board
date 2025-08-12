import { Component, inject, input, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, repeat, take } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CommentInstance } from '../../../core/models/classes/CommentInstance';
import { CommentService } from '../../../core/api/comment.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

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
  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);

  taskId = input.required<number>();

  commentForm: FormGroup;
  comments$!: Observable<CommentInstance[]>;

  constructor() {
    this.commentForm = this.fb.group({
      newComment: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const taskId = this.taskId();
    if (taskId) {
      this.comments$ = this.commentService
        .getComments(taskId)
        .pipe(repeat({ delay: COMMENTS_UPDATE_TIMEOUT_S }));
    }
  }

  addComment(): void {
    const value = this.commentForm.value.newComment.trim();
    const taskId = this.taskId();
    if (value && this.commentForm.valid && taskId) {
      this.commentService
        .createComment({
          content: value,
          taskId: taskId,
        })
        .pipe(take(1))
        .subscribe(() => {
          this.commentForm.get('newComment')?.setValue('');
        });
    }
  }

  removeComment(comment: CommentInstance): void {
    console.log('Remove comment:', comment.id);
  }
} 