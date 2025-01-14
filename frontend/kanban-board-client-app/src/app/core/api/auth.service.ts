/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `/api/api/auth`;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private helper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null'),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem('access_token');
  }

  login(user: { username: string; password: string }): Observable<any> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    return this.http
      .post<any>(`${this.apiUrl}/login`, {
        username: user.username,
        password: user.password,
      })
      .pipe(
        tap((response) => {
          console.log('response', response);
          if (response.token) {
            localStorage.setItem('access_token', response.token);
            const user = this.helper.decodeToken(response.token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            console.log(user);
          }
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.token;
    return !!(token && !this.helper.isTokenExpired(token));
  }

  getRoles(): string[] {
    const user = this.currentUserValue;
    return user?.roles || [];
  }

  register(user: {
    username: string;
    password: string;
    name: string;
  }): Observable<object> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}
