import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { HelpComponent } from '../../help/help.component';

export const HELP_ROUTES: Routes = [
  {
    path: 'help',
    title: 'Help',
    loadComponent: () => HelpComponent,
    canActivate: [authGuard],
  },
];
