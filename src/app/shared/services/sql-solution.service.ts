import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomEncoder } from '../custom-encoder';
import {SqlExercise, SqlResult, SqlSolution, SqlTopic} from '../models/sql-exercise.model';
import {NavNode} from '../models/nav.node';
import {SizeModels} from '../models/size.model';

@Injectable({
  providedIn: 'root'
})
export class SqlTopicService {

  urlJedu = `${environment.url}/`;

  constructor(private http: HttpClient) { }

  all(): Observable<SqlTopic[]> {
    const url = this.urlJedu + 'sqlSolution/getTopics';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<SqlTopic[]>(url, params);
  }

  getById(id: number): Observable<SqlTopic> {
    const url = this.urlJedu + `sqlTopic/getById`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('id', String(id));
    return this.http.post<SqlTopic>(url, params);
  }

}

@Injectable({
  providedIn: 'root'
})
export class SqlSolutionService {

  urlJedu = `${environment.url}/`;

  constructor(private http: HttpClient) { }

  all(topicId: number): Observable<SqlExercise[]> {
    const url = this.urlJedu + 'sqlSolution/all';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', String(topicId));
    return this.http.post<SqlExercise[]>(url, params);
  }

  getById(id: number): Observable<SqlExercise> {
    const url = this.urlJedu + `sqlExercise/getById`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('id', String(id));
    return this.http.post<SqlExercise>(url, params);
  }

  check(id: number, select: string): Observable<SqlResult> {
    const url = this.urlJedu + `sqlSolution/check`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('select', select);
    params = params.append('id', String(id));
    return this.http.post<SqlResult>(url, params);
  }

  getSolution(exerciseId: number): Observable<SqlSolution> {
    const url = this.urlJedu + `sqlSolution/getSolution`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('exerciseId', String(exerciseId));
    return this.http.post<SqlSolution>(url, params);
  }

  wipeSolution(exerciseId: number): Observable<any> {
    const url = this.urlJedu + `sqlSolution/wipeSolution`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('exerciseId', String(exerciseId));
    return this.http.post<any>(url, params);
  }

  total(): Observable<{total: number}> {
    const url = this.urlJedu + `sqlSolution/getTotal`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    return this.http.post<{total: number}>(url, params);
  }

  getNavsForExercises(topicId: string, exerciseId: string): Observable<NavNode[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = topicId ? params.append('topicId', topicId) : params;
    params = exerciseId ? params.append('exerciseId', exerciseId) : params;
    const url = this.urlJedu + `sqlSolution/breadcrumbs`;
    return this.http.post<NavNode[]>(url, params);
  }

  solvedSize(exerciseId: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('exerciseId', String(exerciseId));
    const url = this.urlJedu + `sqlSolution/solvedSize`;
    return this.http.post<SizeModels>(url, params);
  }
}
