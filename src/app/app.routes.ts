import { Routes } from '@angular/router';
import {Login} from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
