import { Injectable } from '@angular/core';
import { DBConstat } from '../components/constants/dbconstat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';
import { Aopt } from '../models/aopt.model';

@Injectable({
  providedIn: 'root'
})
export class AoptsService {

  private url = DBConstat.dbURL;

  constructor(private http: HttpClient) {
  }

  getByAnswerId(id): Observable<Aopt[]> {
    const url = this.url + 'aqopt/getByAnswerId';
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post<Aopt[]>(url, params);
  }

  getById(id): Observable<Aopt[]> {
    const url = this.url + 'aqopt/getById';
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post<Aopt[]>(url, params);
  }

  get(): Observable<Aopt[]> {
    const url = this.url + 'aqopt/get';
    let params = new HttpParams();
    return this.http.post<Aopt[]>(url, params);
  }

  saveOrUpdateQuestion(aopt: Aopt) {
    const url = aopt.id === 0 ? this.url + 'aqopt/add' : this.url + 'aqopt/update';
    let params = new HttpParams();
    params = params.append('id', String(aopt.id));
    params = params.append('answer', String(aopt.answer.id));
    params = params.append('opt', String(aopt.opt.id));
    return this.http.post(url, params);
  }
}
