import { Component, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';

export interface Tile {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  route?: string;
  color: 'primary' | 'accent' | 'warn';
  badge?: string;
  disabled?: boolean;
}

const DEFAULT_TILE: Tile = {
  title: 'default',
  color: 'primary',
  id: 'id',
};

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
  readonly tile = input<Tile>(DEFAULT_TILE);
  readonly size = input<'small' | 'medium' | 'large'>('small');
  readonly tileClick = new EventEmitter<Tile>();

  onTileClick(): void {
    if (!this.tile().disabled) {
      this.tileClick.emit(this.tile());
    }
  }
}
