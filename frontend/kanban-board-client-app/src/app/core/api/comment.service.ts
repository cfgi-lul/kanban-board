import { map, Observable } from 'rxjs';
import { Comment } from '../models/classes/Comment';
import { CommentDTO } from '../models/requestModels/model/commentDTO';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  apiUrl = '/api/comments';
  constructor(private http: HttpClient) {}

  getComments(taskId: number): Observable<Comment[]> {
    return this.http
      .get<CommentDTO[]>(`${this.apiUrl}/task/${taskId}`)
      .pipe(map(e => e.map(el => new Comment(el))));
  }

  createComment(comment: {
    content: string;
    taskId: number;
  }): Observable<Comment> {
    console.log('createComment', comment);
    return this.http
      .post<CommentDTO>(this.apiUrl, comment)
      .pipe(map(e => new Comment(e)));
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl, {
      params: { id: id.toString() },
    });
  }
}
