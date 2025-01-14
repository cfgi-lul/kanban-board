import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Column } from '../models/classes/Column';
import { ColumnDTO } from '../models/requestModels/model/columnDTO';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private readonly baseUrl = '/api/columns';
  constructor(private http: HttpClient) {}

  getAllColumns(id: number): Observable<Column[]> {
    let params = new HttpParams();
    params = params.set('id', id.toString());
    return this.http
      .get<ColumnDTO[]>(this.baseUrl, { params })
      .pipe(map((e) => e.map((el) => new Column(el))));
  }

  createColumn(column: Column): Observable<Column> {
    return this.http
      .post<ColumnDTO>(this.baseUrl, column)
      .pipe(map((e) => new Column(e)));
  }

  deleteColumn(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(this.baseUrl, { params });
  }
}
