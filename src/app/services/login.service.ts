import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IUserLogin } from '../models/iuser-login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl: string = environment.baseUrl;

  constructor(private HttpClient: HttpClient) {}
  
  login(data : any): Observable<IUserLogin>{
    return this.HttpClient.post<IUserLogin>(`${this.baseUrl}api/Account/Login`, data);
  }
}
