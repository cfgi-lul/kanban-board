import { Component, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'kn-tile',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatRippleModule,
  ],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent {
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly icon = input<string>('');
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  readonly size = input<'small' | 'medium' | 'large'>('small');
  readonly tileClick = new EventEmitter<void>();

  onTileClick(): void {
    this.tileClick.emit();
  }
}
