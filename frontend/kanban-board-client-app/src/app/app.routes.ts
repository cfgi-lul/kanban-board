import { AdminComponentComponent } from './admin-component/admin-component.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { AnalyticsComponent } from './analytics/analytics.component';
import { BoardComponent } from './board/board.component';
import { BoardsListComponent } from './boards-list/boards-list.component';
import { HelpComponent } from './help/help.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NewsComponent } from './news/news.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { Routes } from '@angular/router';
import { SettingsComponent } from './core/components/settings/settings.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
  { path: 'sign-in', title: 'Sign In', loadComponent: () => SignInComponent },
  { path: 'sign-up', title: 'Sign Up', loadComponent: () => SignUpComponent },
  {
    path: 'main',
    title: 'Main Page',
    loadComponent: () => MainPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'news',
    title: 'News',
    loadComponent: () => NewsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'analytics',
    title: 'Analytics',
    loadComponent: () => AnalyticsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'help',
    title: 'Help',
    loadComponent: () => HelpComponent,
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
    path: 'admin',
    title: 'Admin Panel',
    loadComponent: () => AdminComponentComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'boards-list',
    title: 'list',
    loadComponent: () => BoardsListComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', loadComponent: () => NotFoundComponent },
];
