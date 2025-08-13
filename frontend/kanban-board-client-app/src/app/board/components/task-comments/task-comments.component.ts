import { Component, inject, input, OnInit } from '@angular/core';
import {
  Observable,
  take,
  switchMap,
  map,
  scan,
  startWith,
  shareReplay,
} from 'rxjs';
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
import { StompService } from '../../../core/services/stomp.service';
// Removed user display and mentions parsing for streamlined chat UI

type CommentSocketEvent = {
  type: 'CREATED' | 'UPDATED' | 'DELETED';
  taskId: number;
  comment?: CommentInstance;
  commentId?: number;
};

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
  private stomp = inject(StompService);

  taskId = input.required<number>();

  commentControl = new FormControl('', { nonNullable: true });
  comments$!: Observable<CommentInstance[]>;

  constructor() {}

  ngOnInit(): void {
    const taskId = this.taskId();
    if (!taskId) return;

    const initial$ = this.commentService.getComments(taskId);

    const updates$ = this.stomp
      .watch<CommentSocketEvent>(`/topic/task/${taskId}/comments`)
      .pipe(
        map(evt => (list: CommentInstance[]): CommentInstance[] => {
          if (evt.type === 'CREATED' && evt.comment) {
            const created = new CommentInstance(evt.comment);
            return [created, ...list];
          }
          if (evt.type === 'UPDATED' && evt.comment) {
            const updated = new CommentInstance(evt.comment);
            return list.map(c => (c.id === updated.id ? updated : c));
          }
          if (evt.type === 'DELETED' && evt.commentId) {
            return list.filter(c => c.id !== evt.commentId);
          }
          return list;
        })
      );

    this.comments$ = initial$.pipe(
      switchMap(initial =>
        updates$.pipe(
          startWith((_: CommentInstance[]) => initial),
          scan((state, reducer) => reducer(state), [] as CommentInstance[]),
          shareReplay({ bufferSize: 1, refCount: true })
        )
      )
    );
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
