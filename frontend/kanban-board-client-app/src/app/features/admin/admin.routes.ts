import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminComponentComponent } from '../../admin-component/admin-component.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    title: 'admin.title',
    loadComponent: () => AdminComponentComponent,
    canActivate: [adminGuard],
  },
  { path: '**', redirectTo: '' },
];
