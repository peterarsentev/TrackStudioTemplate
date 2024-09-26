import { Injectable } from '@angular/core';
import { DBConstat } from '../components/constants/dbconstat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';
import { Aopt } from '../models/aopt.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AoptsService {

  private url =  `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  getByExamIdQuestionId(examId, questionId): Observable<Aopt[]> {
    const url = this.url + 'answer/getByExamIdQuestionId';
    let params = new HttpParams();
    params = params.append('examId', examId);
    params = params.append('questionId', questionId);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<Aopt[]>(url, params);
  }

  getByAnswerId(id): Observable<Aopt[]> {
    const url = this.url + 'aqopt/getByAnswerId';
    let params = new HttpParams();
    params = params.append('id', id);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
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
}
