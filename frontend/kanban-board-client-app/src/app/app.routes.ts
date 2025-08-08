import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features').then(m => m.DASHBOARD_ROUTES),
  },
  {
    path: 'news',
    loadChildren: () => import('./features').then(m => m.NEWS_ROUTES),
  },
  {
    path: 'analytics',
    loadChildren: () => import('./features').then(m => m.ANALYTICS_ROUTES),
  },
  {
    path: 'help',
    loadChildren: () => import('./features').then(m => m.HELP_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features').then(m => m.ADMIN_ROUTES),
  },
  { path: '', redirectTo: '/dashboard/main', pathMatch: 'full' },
  { path: '**', loadComponent: () => NotFoundComponent },
];
