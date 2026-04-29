// auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../auth/token-service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();

  if (token && tokenService.isTokenValid()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Unauthorized access - redirecting to login');
        tokenService.clearToken();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};