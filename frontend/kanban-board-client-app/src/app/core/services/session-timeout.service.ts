import { Injectable, inject } from '@angular/core';
import { AuthService } from '../api/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  private warningTimeout?: number;
  private logoutTimeout?: number;
  private readonly WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry
  private readonly CHECK_INTERVAL = 60 * 1000; // Check every minute

  constructor() {
    this.startSessionMonitoring();
  }

  startSessionMonitoring(): void {
    // Check session status every minute
    window.setInterval(() => {
      this.checkSessionStatus();
    }, this.CHECK_INTERVAL);
  }

  private checkSessionStatus(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    const token = this.authService.token;
    if (!token) {
      this.handleSessionExpiry();
      return;
    }

    // Check if token is about to expire
    const expirationDate =
      this.authService['helper'].getTokenExpirationDate(token);
    if (!expirationDate) {
      this.handleSessionExpiry();
      return;
    }

    const timeUntilExpiry = expirationDate.getTime() - Date.now();

    if (timeUntilExpiry <= 0) {
      // Token has expired
      this.handleSessionExpiry();
    } else if (timeUntilExpiry <= this.WARNING_TIME && !this.warningTimeout) {
      // Show warning 5 minutes before expiry
      this.showSessionWarning(timeUntilExpiry);
    }
  }

  private showSessionWarning(timeUntilExpiry: number): void {
    const minutesLeft = Math.ceil(timeUntilExpiry / (60 * 1000));

    this.snackBar
      .open(
        `Your session will expire in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}. Click to extend.`,
        'Extend Session',
        {
          duration: 0, // Don't auto-dismiss
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['warning-snackbar'],
        }
      )
      .onAction()
      .subscribe(() => {
        this.extendSession();
      });

    // Set timeout to logout when session expires
    this.logoutTimeout = window.setTimeout(() => {
      this.handleSessionExpiry();
    }, timeUntilExpiry);
  }

  private extendSession(): void {
    // Try to refresh the token
    this.authService.refreshCurrentUser().subscribe({
      next: () => {
        this.snackBar.open('Session extended successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        // Clear warning timeout
        if (this.warningTimeout) {
          window.clearTimeout(this.warningTimeout);
          this.warningTimeout = undefined;
        }
        if (this.logoutTimeout) {
          window.clearTimeout(this.logoutTimeout);
          this.logoutTimeout = undefined;
        }
      },
      error: () => {
        this.handleSessionExpiry();
      },
    });
  }

  private handleSessionExpiry(): void {
    this.authService.logout();
    this.snackBar.open(
      'Your session has expired. Please sign in again.',
      'Close',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      }
    );
  }

  // Public method to manually extend session
  extendSessionManually(): void {
    this.extendSession();
  }

  // Clean up timeouts
  ngOnDestroy(): void {
    if (this.warningTimeout) {
      window.clearTimeout(this.warningTimeout);
    }
    if (this.logoutTimeout) {
      window.clearTimeout(this.logoutTimeout);
    }
  }
}
