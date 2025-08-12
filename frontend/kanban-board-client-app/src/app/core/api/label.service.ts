import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LabelInstance } from '../models/classes/LabelInstance';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private http = inject(HttpClient);

  private readonly baseUrl = '/api/labels';

  getLabelsByBoard(boardId: number): Observable<LabelInstance[]> {
    return this.http.get<LabelInstance[]>(`${this.baseUrl}/board/${boardId}`);
  }

  getLabelById(id: number): Observable<LabelInstance> {
    return this.http.get<LabelInstance>(`${this.baseUrl}/${id}`);
  }

  createLabel(label: Partial<LabelInstance>): Observable<LabelInstance> {
    return this.http.post<LabelInstance>(this.baseUrl, label);
  }

  updateLabel(id: number, label: Partial<LabelInstance>): Observable<LabelInstance> {
    return this.http.put<LabelInstance>(`${this.baseUrl}/${id}`, label);
  }

  deleteLabel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
} 