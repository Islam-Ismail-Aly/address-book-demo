import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { IDashboard } from '../../models/admin-models/idashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl: string = environment.baseUrl;
  token: string | null ='';

  constructor(private httpClient: HttpClient) {}

  getDashboardData(): Observable<IDashboard> {
    // this.token = localStorage.getItem('token');
    // if (!this.token) {
    //   throw new Error('Access token not found');
    // }
    
    //const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    
    return this.httpClient.get<IDashboard>(`${this.baseUrl}api/Dashboard/GetDashboardData`)
      .pipe(
        catchError(error => {
          // Handle unauthorized errors or other HTTP errors
          if (error.status === 401) {
            // Unauthorized: Redirect the user to the login page or handle the error appropriately
            console.error('Unauthorized request');
            // Example: Redirect to login page
            // this.router.navigate(['/login']);
          }
          return throwError(() => error.message);
        })
      );
  }
}
