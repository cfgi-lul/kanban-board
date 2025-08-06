import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule, MatIconModule],
  template: `
    <div class="analytics-container">
      <h1 translate="analytics.title"></h1>
      <p translate="analytics.comingSoon"></p>
    </div>
  `,
  styles: [
    `
      :host {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
      }

      .analytics-container {
        min-height: 100%;
        padding: 24px;
        text-align: center;
        box-sizing: border-box;
        width: 100%;
        overflow-x: hidden;
      }
    `,
  ],
})
export class AnalyticsComponent {}
