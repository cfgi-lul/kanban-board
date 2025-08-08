import { Component, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';

import { MatRippleModule } from '@angular/material/core';
import { TileComponent } from '../core/components/tile/tile.component';

const TILES: {
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'accent' | 'warn';
  route: string;
  size: 'large' | 'medium' | 'small';
}[] = [
  {
    title: 'main.boards.title',
    description: 'main.boards.description',
    icon: 'dashboard',
    color: 'primary',
    route: '/dashboard/boards-list',
    size: 'large',
  },
  {
    title: 'main.news.title',
    description: 'main.news.description',
    icon: 'newspaper',
    color: 'accent',
    route: '/news/news',
    size: 'small',
  },
  {
    title: 'main.analytics.title',
    description: 'main.analytics.description',
    icon: 'analytics',
    color: 'primary',
    route: '/analytics/analytics',
    size: 'small',
  },
  {
    title: 'main.settings.title',
    description: 'main.settings.description',
    icon: 'settings',
    color: 'accent',
    route: '/dashboard/settings',
    size: 'small',
  },
  {
    title: 'main.admin.title',
    description: 'main.admin.description',
    icon: 'admin_panel_settings',
    color: 'warn',
    route: '/admin/admin',
    size: 'small',
  },
  {
    title: 'main.help.title',
    description: 'main.help.description',
    icon: 'help',
    color: 'primary',
    route: '/help/help',
    size: 'small',
  },
];

@Component({
  selector: 'kn-main-page',
  imports: [
    TranslateModule,
    MatDividerModule,
    TileComponent,
    RouterLink,
    MatRippleModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  tiles = TILES;
}
