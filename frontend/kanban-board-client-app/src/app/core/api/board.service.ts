import { HttpClient, HttpParams } from '@angular/common/http';
import { Board } from '../models/classes/Board';
import { BoardDTO } from '../models/requestModels/model/boardDTO';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import type { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly baseUrl = '/api/boards';

  constructor(private httpClient: HttpClient) {}

  getAllBoards(): Observable<Board[]> {
    return this.httpClient
      .get<BoardDTO[]>(this.baseUrl)
      .pipe(map(e => e.map(el => new Board(el))));
  }

  getBoardById(id: string): Observable<Board> {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.httpClient
      .get<BoardDTO[]>(this.baseUrl, { params })
      .pipe(map(e => new Board(e[0])));
  }

  createBoard(board: Partial<BoardDTO>): Observable<Board> {
    return this.httpClient
      .post<BoardDTO>(this.baseUrl, board)
      .pipe(map(e => new Board(e)));
  }

  createRandomBoard(): Observable<Board> {
    return this.httpClient
      .post<BoardDTO>(`${this.baseUrl}/random`, null)
      .pipe(map(e => new Board(e)));
  }

  deleteBoard(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.httpClient.delete<void>(this.baseUrl, { params });
  }
}
