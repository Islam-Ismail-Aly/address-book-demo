import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IJob } from '../../models/admin-models/ijob';

@Injectable({
  providedIn: 'root'
})
export class JobService {
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

  getAllJobs(): Observable<IJob[]> {
    //const headers = this.getHeaders();
    return this.httpClient.get<IJob[]>(`${this.baseUrl}api/Job/GetAllJobs`, /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  getJobById(id: number): Observable<IJob> {
    //const headers = this.getHeaders();
    return this.httpClient.get<IJob>(`${this.baseUrl}api/Job/GetJobById/${id}`, /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  createJob(job: IJob): Observable<IJob> {
    //const headers = this.getHeaders();
    return this.httpClient.post<IJob>(`${this.baseUrl}api/Job/AddJob`, job, /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateJob(id: number, job: IJob): Observable<IJob> {
    //const headers = this.getHeaders();
    return this.httpClient.put<IJob>(`${this.baseUrl}api/Job/UpdateJob/${id}`, job, /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteJob(id: number): Observable<void> {
    //const headers = this.getHeaders();
    return this.httpClient.delete<void>(`${this.baseUrl}api/Job/DeleteJob/${id}`, /*{ headers }*/)
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
