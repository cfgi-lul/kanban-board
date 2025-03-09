import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/classes/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  promoteToAdmin(userId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${userId}/promote-to-admin`,
      {},
    );
  }
}
