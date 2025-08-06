import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

interface MainPageTile {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: 'primary' | 'accent' | 'warn';
  badge?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  tiles: MainPageTile[] = [];

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initializeTiles();
  }

  private initializeTiles(): void {
    this.tiles = [
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
  }

  onTileClick(tile: MainPageTile): void {
    if (!tile.disabled) {
      this.router.navigate([tile.route]);
    }
  }

  getTileClass(tile: MainPageTile): string {
    return `tile-${tile.color}`;
  }
}
