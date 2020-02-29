import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LognModel } from '../models/logn.model';

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(user: LognModel) {
    let param = new HttpParams();
    param = param.append('action', user.action);
    param = param.append('login', user.action);
    param = param.append('password', user.action);
    return this.http.post(`${environment.url}/rest/auth/`, param);
  }
}
