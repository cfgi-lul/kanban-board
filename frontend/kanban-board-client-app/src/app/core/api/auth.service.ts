/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Observable, tap, catchError, throwError, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { User } from '../models/classes/User';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `/api/api/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private helper = new JwtHelperService();
  private tokenRefreshTimeout?: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();

    // Check token validity on app start
    this.validateTokenOnStart();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem('access_token');
  }

  public get isTokenExpired(): boolean {
    const token = this.token;
    return !token || this.helper.isTokenExpired(token);
  }

  private getUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  }

  private validateTokenOnStart(): void {
    if (this.token && !this.isTokenExpired) {
      // Token is valid, set up refresh timer
      this.setupTokenRefresh();
    } else if (this.token && this.isTokenExpired) {
      // Token is expired, clear it
      this.logout();
    }
  }

  private setupTokenRefresh(): void {
    if (this.token) {
      const expirationDate = this.helper.getTokenExpirationDate(this.token);
      if (expirationDate) {
        const timeUntilExpiry = expirationDate.getTime() - Date.now();
        const refreshTime = Math.max(timeUntilExpiry - 60000, 0); // Refresh 1 minute before expiry

        this.tokenRefreshTimeout = setTimeout(() => {
          this.refreshToken();
        }, refreshTime);
      }
    }
  }

  public refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.setupTokenRefresh();
        }
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem('access_token', token);
    const user = this.helper.decodeToken(token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Clear any existing tokens
    this.clearAuthData();

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.setupTokenRefresh();
        }
      }),
      catchError(this.handleAuthError.bind(this))
    );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/sign-in']);
  }

  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
      this.tokenRefreshTimeout = undefined;
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.clearAuthData();

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.setupTokenRefresh();
        }
      }),
      catchError(this.handleAuthError.bind(this))
    );
  }

  isAuthenticated(): boolean {
    return !this.isTokenExpired && !!this.currentUserValue;
  }

  getRoles(): string[] {
    const user = this.currentUserValue;
    return user?.roles || [];
  }

  public isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  public hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  public getBoardRoles(boardId: number): Observable<string[]> {
    return this.http.get<string[]>(
      `/api/boards/${boardId}/users/${this.currentUserValue?.id}/role`
    ).pipe(
      catchError(error => {
        console.error('Error fetching board roles:', error);
        return of([]);
      })
    );
  }

  public getDisplayName(): string {
    const user = this.currentUserValue;
    if (!user) return 'Guest';
    return user.name || user.username || 'Unknown User';
  }

  public getUserInitials(): string {
    const user = this.currentUserValue;
    if (!user?.name) return '?';

    const names = user.name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  current(): Observable<User | null> {
    return this.http.get<User>('/api/users/current').pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        } else {
          this.clearAuthData();
        }
      }),
      catchError(error => {
        console.error('Error fetching current user:', error);
        this.clearAuthData();
        return of(null);
      })
    );
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Authentication failed';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Invalid credentials';
    } else if (error.status === 403) {
      errorMessage = 'Access denied';
    } else if (error.status === 0) {
      errorMessage = 'Network error - please check your connection';
    }

    console.error('Auth error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
