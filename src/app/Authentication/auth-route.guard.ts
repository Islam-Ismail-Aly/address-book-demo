import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

export const authRouteGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  const isAuthenticated = authService.isAuthenticated;
  const isAdminAuthorized = authService.isAdminAuthorized;

  if (isAuthenticated && (state.url.includes('login') || state.url.includes('register'))) {
    Swal.fire('Error!', 'You are already logged in!', 'warning');
    router.navigate(['/address-book']);
    return false;
  }

  if (route.data['authenticated'] && !isAuthenticated) {
    Swal.fire('Login Error!', 'Please log in first!', 'error');
    router.navigate(['/login']);
    return false;
  }

  if (route.data['admin'] && !isAdminAuthorized) {
    Swal.fire({
      title: 'Unauthorized!',
      text: 'You don\'t have permission to access this page.',
      icon: 'warning',
      timer: 3500,
      showConfirmButton: false,
      width: '500px',
      customClass: {
        popup: 'custom-popup-class',
        title: 'custom-title-class'
      }
    });
    router.navigate(['/address-book']);
    return false;
  }

  return true;

  // if (isAuthenticated)
  // {
  //   console.log(isAuthenticated);
  //   return true;
  // }
  // else if (isAdminAuthorized && isAuthenticated)
  // {
  //   console.log(isAdminAuthorized, isAuthenticated);
  //   return true;
  // }
  // else 
  // {
  //   console.log(isAuthenticated);  
  //   Swal.fire('Login Error!', 'please login first!', 'error');
  //   inject(Router).navigate(['/login'])
  //   return false;
  // }
};
