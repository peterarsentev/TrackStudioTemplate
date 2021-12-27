import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';
import { environment } from '../../../environments/environment';

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

  saveOrUpdateQuestion(answer: Answer): Observable<Answer> {
    const url = answer.id ? this.url + 'answer/add' : this.url + 'answer/update';
    let params = new HttpParams();
    params = params.append('id', String(answer.id));
    params = params.append('question', String(answer.question.id));
    params = params.append('examuser', String(answer.examuser.id));
    return this.http.post<Answer>(url, params);
  }

}
