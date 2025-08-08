import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { NewsComponent } from '../../news/news.component';

export const NEWS_ROUTES: Routes = [
  {
    path: 'news',
    title: 'News',
    loadComponent: () => NewsComponent,
    canActivate: [authGuard],
  },
];
