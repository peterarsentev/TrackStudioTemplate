import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExamModels } from '../models/exam.models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ICodeExample } from 'tslint';
import { ExamUser } from '../models/examuser.model';
import { DBConstat } from '../components/constants/dbconstat';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {

  private url = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {
  }

  get(): Observable<ExamModels[]> {
    const url = this.url + 'exam/get';
    const params = new HttpParams();
    return this.http.post<ExamModels[]>(url, params);
  }

  getActiveExams(): Observable<ExamModels[]> {
    const url = this.url + 'exam/getActive';
    const params = new HttpParams();
    return this.http.post<ExamModels[]>(url, params);
  }

  getExamById(id): Observable<ExamModels> {
    const url = this.url + 'exam/getById';
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post<ExamModels>(url, params);
  }

  saveOrUpdateExam(save: boolean, examen: ExamModels) {
    const url = save ? this.url + 'exam/add' : this.url + 'exam/update';
    let params = new HttpParams();
    params = save ? params : params.append('id', String(examen.id));
    params = params.append('name', examen.name);
    params = params.append('description', examen.description);
    params = params.append('description', examen.description);
    params = params.append('active', String(examen.active));
    params = params.append('intro', examen.intro);
    params = params.append('position', String(examen.position));
    return this.http.post(url, params);
  }
}
