import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { VacancyModels } from '../shared/models/vacancy.models';
import { CustomEncoder } from '../shared/custom-encoder';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class VacancyService {

  private  eduUrl = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {}


  save(vacancy: VacancyModels): Observable<{ id: number }> {
    const url = this.eduUrl + 'vacancy/create';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('name', vacancy.name);
    params = params.append('description', vacancy.description);
    params = params.append('open', String(vacancy.open));
    return this.http.post< { id: number }>(url, params);
  }

  getById(id: string): Observable<VacancyModels> {
    const url = this.eduUrl + 'vacancy/getById';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', id);
    return this.http.post<VacancyModels>(url, params);
  }

  getAll(open: boolean, my: boolean): Observable<VacancyModels[]> {
    const url = this.eduUrl + 'vacancy/findList';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('open', '' + open);
    params = params.append('my', '' + my);
    return this.http.post<VacancyModels[]>(url, params);
  }

  delete(id: number) {
    const url = this.eduUrl + 'vacancy/delete';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', '' + id);
    return this.http.post(url, params);
  }

  update(vacancy: VacancyModels) {
    const url = this.eduUrl + 'vacancy/update';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('name', vacancy.name);
    params = params.append('id', '' + vacancy.id);
    params = params.append('description', vacancy.description);
    params = params.append('open', String(vacancy.open));
    return this.http.post< { id: number }>(url, params);
  }
}
