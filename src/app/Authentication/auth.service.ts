import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  get isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  get isAdminAuthorized(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  // login(token: string): void {
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('isAuthenticated', 'true');
  // }

  get getToken() : string | null {
    return localStorage.getItem('token');
  }

  get getRole() : string | null {
    return localStorage.getItem('role');
  }

  get getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  Logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.clear();

    Swal.fire({
      title: 'Logout!',
      text: 'Logout successfully, redirect to login page.',
      icon: 'info',
      timer: 2500,
      showConfirmButton: false,
      width: '500px',
    });

  }

}
