import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IUserRegister } from '../models/iuser-register';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http:HttpClient) { }
  
  Register(data:any): Observable<IUserRegister>{
    return this.http.post<IUserRegister>(`${this.baseUrl}`,data);
  }
}
