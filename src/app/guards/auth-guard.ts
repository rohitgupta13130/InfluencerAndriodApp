import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token'); // ✅ use token
  const userType = localStorage.getItem('userType');

  // 🔥 Check token instead of isLoggedIn
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  const expectedType = route.data?.['expectedType'];

  if (expectedType && userType?.toLowerCase() !== expectedType.toLowerCase()) {

    switch(userType?.toLowerCase()) {
      case 'influencer':
        return router.createUrlTree(['/influencer-dashboard']);
      case 'admin':
        return router.createUrlTree(['/admin-dashboard']);
      case 'user':
        return router.createUrlTree(['/user-dashboard']);
      default:
        return router.createUrlTree(['/login']);
    }
  }

  return true;
};