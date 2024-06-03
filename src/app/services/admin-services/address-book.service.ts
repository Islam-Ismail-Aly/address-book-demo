import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IAddressBook } from '../../models/admin-models/iaddress-book';


@Injectable({
  providedIn: 'root'
})
export class AddressBookService {
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

  getAllAddressBooks(startDate?: any, endDate?: any): Observable<IAddressBook[]> {
    //const headers = this.getHeaders();
    let params = new HttpParams();
    if (startDate) {
      params = params.append('startDateOfBirth', startDate);
    }
    if (endDate) {
      params = params.append('endDateOfBirth', endDate);
    }
    return this.httpClient.get<IAddressBook[]>(`${this.baseUrl}api/AddressBook/GetAllEmployees`, { params: params } /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAddressBookById(id: number): Observable<IAddressBook> {
    //const headers = this.getHeaders();
    return this.httpClient.get<IAddressBook>(`${this.baseUrl}api/AddressBook/GetEmployeeById/${id}`, /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  createAddressBook(addressBook: IAddressBook): Observable<IAddressBook> {
    //const headers = this.getHeaders();
    return this.httpClient.post<IAddressBook>(`${this.baseUrl}api/AddressBook/AddEmployee`, addressBook, /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAddressBook(id: number, addressBook: IAddressBook): Observable<IAddressBook> {
    //const headers = this.getHeaders();
    return this.httpClient.put<IAddressBook>(`${this.baseUrl}api/AddressBook/UpdateEmployee/${id}`, addressBook, /*{ headers }*/)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAddressBook(id: number): Observable<void> {
    //const headers = this.getHeaders();
    return this.httpClient.delete<void>(`${this.baseUrl}api/AddressBook/DeleteEmployee/${id}`, /*{ headers }*/)
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
