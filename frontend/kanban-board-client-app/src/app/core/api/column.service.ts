import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ColumnInstance } from '../models/classes/ColumnInstance';
import { ColumnDTO } from '../models/requestModels/model/columnDTO';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private http = inject(HttpClient);

  private readonly baseUrl = '/api/columns';

  getAllColumns(id: number): Observable<ColumnInstance[]> {
    let params = new HttpParams();
    params = params.set('id', id.toString());
    return this.http
      .get<ColumnDTO[]>(this.baseUrl, { params })
      .pipe(map(e => e.map(el => new ColumnInstance(el))));
  }

  createColumn(column: ColumnInstance): Observable<ColumnInstance> {
    return this.http
      .post<ColumnDTO>(this.baseUrl, column)
      .pipe(map(e => new ColumnInstance(e)));
  }

  deleteColumn(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(this.baseUrl, { params });
  }
}
