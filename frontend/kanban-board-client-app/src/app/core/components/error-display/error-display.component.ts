import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "kn-error-display",
  imports: [MatCardModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    @if (errorMessage()) {
      <mat-card class="error-card">
        <mat-card-content class="error-content">
          <mat-icon color="warn" class="error-icon">error</mat-icon>
          <div class="error-message">{{ errorMessage() }}</div>
          @if (errorDetails()) {
            <div class="error-details">{{ errorDetails() }}</div>
          }
          @if (showRetryButton()) {
            <button
              mat-raised-button
              color="primary"
              class="error-retry"
              (click)="onRetry.emit()"
            >
              <mat-icon class="error-retry-icon">refresh</mat-icon>
              {{ "common.retry" | translate }}
            </button>
          }
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [
    `
      .error-card {
        margin: 16px;
      }

      .error-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 2rem;
      }

      .error-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
      }

      .error-message {
        font-size: 1.2rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
      }

      .error-details {
        color: #666;
        margin-bottom: 1rem;
      }

      .error-retry {
        margin-top: 1rem;
      }

      .error-retry-icon {
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class ErrorDisplayComponent {
  readonly errorMessage = input.required<string>();
  readonly errorDetails = input<string>("");
  readonly showRetryButton = input<boolean>(true);

  readonly onRetry = output<void>();
}
