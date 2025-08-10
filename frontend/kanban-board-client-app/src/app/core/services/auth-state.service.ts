import { Injectable, computed, signal, inject } from '@angular/core';
import { AuthService } from '../api/auth.service';
import { UserInstance } from '../models/classes/UserInstance';
import { toObservable } from '@angular/core/rxjs-interop';

export interface AuthState {
  user: UserInstance | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private authService = inject(AuthService);

  // Signals for reactive state management
  private _user = signal<UserInstance | null>(null);
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

  constructor() {
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

  updateUser(user: UserInstance): void {
    this._user.set(user);
  }

  // Helper methods
  getUserInitials(): string {
    const user = this._user();
    if (!user) return '?';

    // Use displayName for initials if available, fallback to name
    const displayName = user.displayName || user.name;
    if (!displayName) return '?';

    const names = displayName.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  getDisplayName(): string {
    const user = this._user();
    if (!user) return 'Guest';
    return user.displayName || user.name || user.username || 'Unknown User';
  }

  hasRole(role: string): boolean {
    const user = this._user();
    return user?.roles?.some(r => r.name === role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}
