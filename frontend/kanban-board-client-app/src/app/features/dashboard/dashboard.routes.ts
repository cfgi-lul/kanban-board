import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { MainPageComponent } from '../../main-page/main-page.component';
import { SettingsComponent } from '../../core/components/settings/settings.component';
import { BoardComponent } from '../../board/board.component';
import { BoardsListComponent } from '../../boards-list/boards-list.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'main',
    title: 'Main Page',
    loadComponent: () => MainPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    title: 'Settings',
    loadComponent: () => SettingsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'board/:id',
    title: 'board',
    loadComponent: () => BoardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'boards-list',
    title: 'list',
    loadComponent: () => BoardsListComponent,
    canActivate: [authGuard],
  },
]; 