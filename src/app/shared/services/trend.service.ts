import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomEncoder} from '../custom-encoder';
import {TrendModel} from '../models/trend.model';

@Injectable({
  providedIn: 'root'
})
export class TrendService {

  private url = `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<TrendModel[]> {
    const url = this.url + `trend/all`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<TrendModel[]>(url, params);
  }
}
