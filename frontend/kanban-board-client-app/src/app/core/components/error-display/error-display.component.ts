import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-error-display',
  template: `
    @if (errorMessage) {
      <mat-card class="error-card">
        <mat-card-title>Error</mat-card-title>
        <mat-card-content>
          <p>{{ errorMessage() }}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="warn" (click)="clearError()">
            Dismiss
          </button>
        </mat-card-actions>
      </mat-card>
    }
  `,
  styles: [
    `
      .error-card {
        background-color: #ffebee;
        color: #d32f2f;
        margin: 16px;
        padding: 16px;
      }
    `,
  ],
  imports: [MatCardModule],
})
export class ErrorDisplayComponent {
  errorMessage = input<string>('Error with request');

  clearError() {
    this.errorMessage = null;
  }
}
