import { Component, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'kn-add-board-card',
  imports: [MatCardModule, MatIconModule, TranslateModule, MatRippleModule],
  templateUrl: './add-board-card.component.html',
  styleUrl: './add-board-card.component.scss',
})
export class AddBoardCardComponent {
  readonly onBoardCreate = output<void>();
}
