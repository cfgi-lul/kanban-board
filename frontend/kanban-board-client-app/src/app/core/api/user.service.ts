import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/classes/User';

export interface UserUpdateRequest {
  displayName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/current`);
  }

  updateCurrentUser(updateRequest: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/current`, updateRequest);
  }

  promoteToAdmin(userId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${userId}/promote-to-admin`,
      {}
    );
  }
}
