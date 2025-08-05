import { AdminComponentComponent } from './admin-component/admin-component.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { BoardComponent } from './board/board.component';
import { BoardsListComponent } from './boards-list/boards-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
  { path: 'sign-in', title: 'Sign In', loadComponent: () => SignInComponent },
  { path: 'sign-up', title: 'Sign Up', loadComponent: () => SignUpComponent },
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
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: '**', loadComponent: () => NotFoundComponent },
];
