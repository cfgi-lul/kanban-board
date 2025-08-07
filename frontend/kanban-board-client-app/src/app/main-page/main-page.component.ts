import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';

import { MatRippleModule } from '@angular/material/core';
import { Tile, TileComponent } from '../core/components/tile/tile.component';


const TILES: Tile[] = [
  {
    id: 'boards',
    title: 'main.boards.title',
    description: 'main.boards.description',
    icon: 'dashboard',
    route: '/boards-list',
    color: 'primary',
  },
  {
    id: 'news',
    title: 'main.news.title',
    description: 'main.news.description',
    icon: 'newspaper',
    route: '/news',
    color: 'accent',
    badge: 'main.news.badge',
  },
  {
    id: 'analytics',
    title: 'main.analytics.title',
    description: 'main.analytics.description',
    icon: 'analytics',
    route: '/analytics',
    color: 'primary',
  },
  {
    id: 'settings',
    title: 'main.settings.title',
    description: 'main.settings.description',
    icon: 'settings',
    route: '/settings',
    color: 'accent',
  },
  {
    id: 'admin',
    title: 'main.admin.title',
    description: 'main.admin.description',
    icon: 'admin_panel_settings',
    route: '/admin',
    color: 'warn',
  },
  {
    id: 'help',
    title: 'main.help.title',
    description: 'main.help.description',
    icon: 'help',
    route: '/help',
    color: 'primary',
  },
];

@Component({
  selector: 'kn-main-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDividerModule,
    TileComponent,
    MatRippleModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  tiles: Tile[] = TILES;
  private router = inject(Router);
  private translate = inject(TranslateService);

  onTileClick(tile: Tile | null | undefined): void {
    if (tile && !tile.disabled) {
      this.router.navigate([tile.route]);
    }
  }
}
