import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    take(1),
    map((isAuthed) => {
      if (isAuthed) {
        return true;
      }

      return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
    })
  );
};
