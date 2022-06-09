import { Injectable } from '@angular/core';
import { DBConstat } from '../components/constants/dbconstat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Question } from '../models/question.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Qopt} from '../models/qopt.model';
import {NavQuestionModel} from '../models/nav.question.models';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private url = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {
  }

  getByExamId(id): Observable<Question[]> {
    const url = this.url + 'question/getByExamId';
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post<Question[]>(url, params);
  }

  next(examId, questionId): Observable<NavQuestionModel> {
    const url = this.url + 'question/next';
    let params = new HttpParams();
    params = params.append('examId', examId);
    params = params.append('questionId', questionId);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<NavQuestionModel>(url, params);
  }

  get(): Observable<Question[]> {
    const url = this.url + 'question/get';
    const params = new HttpParams();
    return this.http.post<Question[]>(url, params);
  }

  getById(id): Observable<Question> {
    const url = this.url + 'question/getById';
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post<Question>(url, params);
  }

  saveOrUpdateQuestion(quest: Question) {
    const save: boolean = quest.id === 0;
    const url = save ? this.url + 'question/add' : this.url + 'question/update';
    let params = new HttpParams();
    params = params.append('id', String(quest.id));
    params = params.append('name', quest.name);
    params = params.append('description', quest.description);
    params = params.append('pos', String(quest.pos));
    params = params.append('hint', quest.hint);
    params = params.append('exam_id', String(quest.exam.id));
    return this.http.post(url, params);
  }
}
