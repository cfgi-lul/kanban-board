import { Routes } from '@angular/router';
import { SignInComponent } from '../../sign-in/sign-in.component';
import { SignUpComponent } from '../../sign-up/sign-up.component';

export const AUTH_ROUTES: Routes = [
  { path: 'sign-in', title: 'Sign In', loadComponent: () => SignInComponent },
  { path: 'sign-up', title: 'Sign Up', loadComponent: () => SignUpComponent },
];
