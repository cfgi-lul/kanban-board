import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { UserInstance } from "../models/classes/UserInstance";

export interface UserUpdateRequest {
  displayName?: string;
  email?: string;
  avatar?: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private http = inject(HttpClient);

  private readonly baseUrl = "/api/users";

  getAllUsers(): Observable<UserInstance[]> {
    return this.http.get<UserInstance[]>(this.baseUrl);
  }

  getCurrentUser(): Observable<UserInstance> {
    return this.http.get<UserInstance>(`${this.baseUrl}/current`);
  }

  updateCurrentUser(
    updateRequest: UserUpdateRequest,
  ): Observable<UserInstance> {
    return this.http.put<UserInstance>(
      `${this.baseUrl}/current`,
      updateRequest,
    );
  }

  promoteToAdmin(userId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${userId}/promote-to-admin`,
      {},
    );
  }
}
