import { map, Observable } from 'rxjs';
import { CommentInstance } from '../models/classes/CommentInstance';
import { CommentDTO } from '../models/requestModels/model/commentDTO';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);

  apiUrl = '/api/comments';

  getComments(taskId: number): Observable<CommentInstance[]> {
    return this.http
      .get<CommentDTO[]>(`${this.apiUrl}/task/${taskId}`)
      .pipe(map(e => e.map(el => new CommentInstance(el))));
  }

  createComment(comment: CommentInstance): Observable<CommentInstance> {
    return this.http
      .post<CommentDTO>(`${this.apiUrl}`, comment)
      .pipe(map(e => new CommentInstance(e)));
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl, {
      params: { id: id.toString() },
    });
  }
}
