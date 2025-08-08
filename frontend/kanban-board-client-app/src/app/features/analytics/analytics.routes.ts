import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { AnalyticsComponent } from '../../analytics/analytics.component';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: 'analytics',
    title: 'Analytics',
    loadComponent: () => AnalyticsComponent,
    canActivate: [authGuard],
  },
];
