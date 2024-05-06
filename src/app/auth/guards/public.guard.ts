import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

const checkAuthStatus = (): boolean | Observable<boolean> => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuth()
    .pipe(

      tap( isAuth => {

        if (isAuth)
          router.navigate(['./']);

      }),

      map( isAuth => !isAuth )

    );
};

export const canActivatePublicGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
   return checkAuthStatus();
 };
