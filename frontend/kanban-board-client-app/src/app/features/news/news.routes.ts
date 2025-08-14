import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { NewsComponent } from '../../news/news.component';

export const NEWS_ROUTES: Routes = [
  {
    path: '',
    title: 'news.title',
    loadComponent: () => NewsComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
