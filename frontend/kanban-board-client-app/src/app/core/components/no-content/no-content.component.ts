import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'kn-no-content',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <mat-card class="no-content-card">
      <mat-card-content class="no-content-content">
        <mat-icon class="no-content-icon">{{ icon() }}</mat-icon>
        <div class="no-content-message">{{ message() }}</div>
        @if (details()) {
          <div class="no-content-details">{{ details() }}</div>
        }
        @if (showActionButton()) {
          <button
            mat-button
            color="primary"
            class="no-content-action"
            (click)="onAction.emit()"
          >
            {{ actionButtonText() }}
          </button>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .no-content-card {
        margin: 16px;
      }

      .no-content-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 2rem;
      }

      .no-content-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
        color: #666;
      }

      .no-content-message {
        font-size: 1.2rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: #333;
      }

      .no-content-details {
        color: #666;
        margin-bottom: 1rem;
      }

      .no-content-action {
        margin-top: 1rem;
      }
    `,
  ],
})
export class NoContentComponent {
  readonly message = input.required<string>();
  readonly details = input<string>('');
  readonly icon = input<string>('search_off');
  readonly showActionButton = input<boolean>(false);
  readonly actionButtonText = input<string>('common.clear');

  readonly onAction = output<void>();
}
