import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AttachmentInstance } from '../models/classes/AttachmentInstance';
import { AttachmentDTO } from '../models/requestModels/model/attachmentDTO';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private http = inject(HttpClient);

  private readonly baseUrl = '/api/attachments';

  getAttachmentsByTask(taskId: number): Observable<AttachmentInstance[]> {
    return this.http
      .get<AttachmentDTO[]>(`${this.baseUrl}/task/${taskId}`)
      .pipe(
        map(attachments =>
          attachments.map(attachment => new AttachmentInstance(attachment))
        )
      );
  }

  getAttachmentById(id: number): Observable<AttachmentInstance> {
    return this.http
      .get<AttachmentDTO>(`${this.baseUrl}/${id}`)
      .pipe(map(attachment => new AttachmentInstance(attachment)));
  }

  uploadAttachment(taskId: number, file: File): Observable<AttachmentInstance> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId.toString());

    return this.http
      .post<AttachmentDTO>(`${this.baseUrl}/upload`, formData)
      .pipe(map(attachment => new AttachmentInstance(attachment)));
  }

  deleteAttachment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  downloadAttachment(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob',
    });
  }
}
