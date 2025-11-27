import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, tap, throwError } from 'rxjs';

import { AuthApi } from '../http/auth.api';

const HAS_RETRIED = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authApi = inject(AuthApi);
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (req.context.get(HAS_RETRIED)) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          router.navigateByUrl('/auth/login');
          return throwError(() => error);
        }

        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          router.navigateByUrl('/auth/login');
          return throwError(() => error);
        }

        return authApi.refreshToken(refreshToken).pipe(
          tap(({ access_token, refresh_token }) => {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
          }),
          switchMap(({ access_token }) => {
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${access_token}`,
              },
              context: req.context.set(HAS_RETRIED, true),
            });
            return next(retryReq);
          }),
          catchError((refreshError: HttpErrorResponse) => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            router.navigateByUrl('/auth/login');
            return throwError(() => refreshError);
          })
        );
      } else if (error.status === 403) {
        router.navigateByUrl('/forbidden');
      }
      return throwError(() => error);
    })
  );
};
