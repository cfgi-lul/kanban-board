import { Injectable, computed, signal } from '@angular/core';
import { AuthService } from '../api/auth.service';
import { User } from '../models/classes/User';
import { toObservable } from '@angular/core/rxjs-interop';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  // Signals for reactive state management
  private _user = signal<User | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Computed values
  public readonly user = this._user.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._user());
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();

  // Observable versions for compatibility
  public readonly user$ = toObservable(this.user);
  public readonly isAuthenticated$ = toObservable(this.isAuthenticated);
  public readonly isLoading$ = toObservable(this.isLoading);
  public readonly error$ = toObservable(this.error);

  constructor(private authService: AuthService) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    // Subscribe to auth service changes
    this.authService.currentUser.subscribe(user => {
      this._user.set(user);
      this._error.set(null);
    });
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  clearError(): void {
    this._error.set(null);
  }

  // Helper methods
  getUserInitials(): string {
    const user = this._user();
    if (!user?.name) return '?';

    const names = user.name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  getDisplayName(): string {
    const user = this._user();
    if (!user) return 'Guest';
    return user.name || user.username || 'Unknown User';
  }

  hasRole(role: string): boolean {
    const user = this._user();
    return user?.roles?.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}
