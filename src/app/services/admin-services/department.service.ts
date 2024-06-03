import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IDepartment } from '../../models/admin-models/idepartment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  baseUrl: string = environment.baseUrl;
  token: string | null = '';

  constructor(private httpClient: HttpClient) {}

  private getHeaders(): HttpHeaders {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      throw new Error('Access token not found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }

  getAllDepartments(): Observable<IDepartment[]> {
    //const headers = this.getHeaders();
    return this.httpClient.get<IDepartment[]>(`${this.baseUrl}api/Department/GetAllDepartments`/*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDepartmentById(id: number): Observable<IDepartment> {
    //const headers = this.getHeaders();
    return this.httpClient.get<IDepartment>(`${this.baseUrl}api/Department/GetDepartmentById/${id}` /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  createDepartment(department: IDepartment): Observable<IDepartment> {
    //const headers = this.getHeaders();
    return this.httpClient.post<IDepartment>(`${this.baseUrl}api/Department/AddDepartment`, department /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateDepartment(id: number, department: IDepartment): Observable<IDepartment> {
    //const headers = this.getHeaders();
    return this.httpClient.put<IDepartment>(`${this.baseUrl}api/Department/UpdateDepartment/${id}`, department /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteDepartment(id: number): Observable<void> {
    //const headers = this.getHeaders();
    return this.httpClient.delete<void>(`${this.baseUrl}api/Department/DeleteDepartmenty/${id}` /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    if (error.status === 401) {
      console.error('Unauthorized request');
      // Example: Redirect to login page
      // this.router.navigate(['/login']);
    }
    return throwError(() => error.message || 'Server error');
  }
}
