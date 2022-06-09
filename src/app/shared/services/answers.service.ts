import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';
import { environment } from '../../../environments/environment';
import {Question} from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class AnswersService {

  private url = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {
  }

  getByExamUserId(userid): Observable<Answer[]> {
    const url = this.url + 'answer/getByUserId';
    let params = new HttpParams();
    params = params.append('userId', userid);
    return this.http.post<Answer[]>(url, params);
  }

  getById(id): Observable<Answer> {
    const url = this.url + 'answer/getById';
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post<Answer>(url, params);
  }

  get(): Observable<Answer[]> {
    const url = this.url + 'answer/get';
    const params = new HttpParams();
    return this.http.post<Answer[]>(url, params);
  }

  save(questionId, examId, aopts): Observable<Answer> {
    let aoptIs = '';
    aopts.forEach(el => aoptIs += el.qoptId + ';');
    const url = this.url + 'answer/save';
    let params = new HttpParams();
    params = params.append('questionId', questionId);
    params = params.append('examId', examId);
    params = params.append('aopts', aoptIs);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<Answer>(url, params);
  }

  getWrongAnswer(examId): Observable<Question[]> {
    const url = this.url + 'answer/getWrongAnswer';
    let params = new HttpParams();
    params = params.append('examId', examId);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<Question[]>(url, params);
  }

}
