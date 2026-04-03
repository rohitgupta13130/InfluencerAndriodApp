import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  // const token = localStorage.getItem('token');

  // if (token) {
  //   return true; // ✅ allow access
  // }

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    return true; // ✅ allow
  }

  // ❌ block + redirect
  router.navigate(['/login']);
  return false;
};