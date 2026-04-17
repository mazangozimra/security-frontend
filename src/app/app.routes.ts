import { Routes } from '@angular/router';
import {Login} from './features/auth/login/login';
import { ListSystem } from './features/systems/list-system/list-system';
import { CreateSystem } from './features/systems/create-system/create-system';
import { EditSystem } from './features/systems/edit-system/edit-system';
import { authGuard } from './core/guards/auth-guard';
import { CreateRole } from './features/roles/create-role/create-role';
import { ListRole } from './features/roles/list-role/list-role';
import { EditRole } from './features/roles/edit-role/edit-role';

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
    path: 'systems',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: ListSystem,
        pathMatch: 'full'
      },
      {
        path: 'create',
        component: CreateSystem
      },
      {
        path: 'edit/:id',
        component: EditSystem
      },
    ]
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: ListRole,
        pathMatch: 'full'
      },
      {
        path: 'create',
        component: CreateRole
      },
      {
        path: 'edit/:id',
        component: EditRole
      },
    ]
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
