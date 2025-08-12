import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttachmentInstance } from '../models/classes/AttachmentInstance';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private http = inject(HttpClient);

  private readonly baseUrl = '/api/attachments';

  getAttachmentsByTask(taskId: number): Observable<AttachmentInstance[]> {
    return this.http.get<AttachmentInstance[]>(`${this.baseUrl}/task/${taskId}`);
  }

  getAttachmentById(id: number): Observable<AttachmentInstance> {
    return this.http.get<AttachmentInstance>(`${this.baseUrl}/${id}`);
  }

  uploadAttachment(taskId: number, file: File): Observable<AttachmentInstance> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId.toString());
    
    return this.http.post<AttachmentInstance>(`${this.baseUrl}/upload`, formData);
  }

  deleteAttachment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  downloadAttachment(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, { responseType: 'blob' });
  }
} 