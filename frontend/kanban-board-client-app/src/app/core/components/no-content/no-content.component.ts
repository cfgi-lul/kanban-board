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
  imports: [MatCardModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <mat-card class="no-content">
      <mat-card-content class="no-content__content">
        <mat-icon class="no-content__icon">{{ icon() }}</mat-icon>
        <div class="no-content__message">{{ message() }}</div>
        @if (details()) {
          <div class="no-content__details">{{ details() }}</div>
        }
        @if (showActionButton()) {
          <button
            mat-button
            color="primary"
            class="no-content__action"
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
      .no-content {
        margin: 16px;

        &__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px;
        }

        &__icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          color: var(--mat-sys-color-on-surface-variant);
        }

        &__message {
          margin-bottom: 8px;
          color: var(--mat-sys-color-on-surface);
          font: var(--mat-sys-title-large);
        }

        &__details {
          color: var(--mat-sys-color-on-surface-variant);
          margin-bottom: 16px;
          font: var(--mat-sys-body-medium);
        }

        &__action {
          margin-top: 16px;
        }
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
