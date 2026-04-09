// core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../auth/login-service';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  
  if (loginService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};