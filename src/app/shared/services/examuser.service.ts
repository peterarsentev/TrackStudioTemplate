import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamUser } from '../models/examuser.model';
import { DBConstat } from '../components/constants/dbconstat';
import { environment } from '../../../environments/environment';
import {LeaderModels} from '../models/leader-models';

@Injectable({
  providedIn: 'root'
})
export class ExamuserService {

  private url = `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  getByExamId(examId): Observable<ExamUser> {
    const url = this.url + 'examuser/getByExamId';
    let params = new HttpParams();
    params = params.append('examId', examId);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<ExamUser>(url, params);
  }

  getByUserId(userId): Observable<ExamUser[]> {
    const url = this.url + 'examuser/getByUserId';
    let params = new HttpParams();
    params = params.append('userId', userId);
    return this.http.post<ExamUser[]>(url, params);
  }

  getById(id): Observable<ExamUser> {
    const url = this.url + 'examuser/getById';
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post<ExamUser>(url, params);
  }

  get(): Observable<ExamUser[]> {
    const url = this.url + 'examuser/get';
    let params = new HttpParams();
    return this.http.post<ExamUser[]>(url, params);
  }

  saveOrUpdateQuestion(examUser: ExamUser): Observable<ExamUser>  {
    const url = examUser.id === 0 ? this.url + 'examuser/add' : this.url + 'examuser/update';
    let params = new HttpParams();
    params = params.append('id', String(examUser.id));
    params = params.append('exam', String(examUser.exam.id));
    params = params.append('result', String(examUser.result));
    params = params.append('start', String(examUser.start));
    params = params.append('finish', String(examUser.finish));
    params = params.append('userId', String(examUser.userid));
    params = params.append('total', String(examUser.total));
    return this.http.post<ExamUser>(url, params);
  }

  getLeaders(examId) {
    const url = this.url + 'examuser/leaders';
    let params = new HttpParams();
    params = params.append('examId', examId);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<LeaderModels[]>(url, params);
  }
}
