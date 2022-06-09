import { Injectable } from '@angular/core';
import { DBConstat } from '../components/constants/dbconstat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Qopt } from '../models/qopt.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QoptsService {

  private url = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {
  }

  getByQuestId(id): Observable<Qopt[]> {
    const url = this.url + 'qoopt/getByQuestId';
    let params = new HttpParams();
    params = params.append('id', id);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<Qopt[]>(url, params);
  }

  getById(id): Observable<Qopt> {
    const url = this.url + 'qoopt/getById';
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post<Qopt>(url, params);
  }

  get(): Observable<Qopt[]> {
    const url = this.url + 'qoopt/get';
    const params = new HttpParams();
    return this.http.post<Qopt[]>(url, params);
  }

  saveOrUpdateQopt(qopt: Qopt) {
    const save: boolean = qopt.id === 0;
    const url = save ? this.url + 'qoopt/add' : this.url + 'qoopt/update';
    let params = new HttpParams();
    params = params.append('id', String(qopt.id));
    params = params.append('description', qopt.description);
    params = params.append('quest_id', String(qopt.question.id));
    params = params.append('correct', String(qopt.correct));
    params = params.append('pos', String(qopt.pos));
    return this.http.post(url, params);
  }
}
