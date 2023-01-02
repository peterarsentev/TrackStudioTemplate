import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { InterviewModel } from '../../shared/models/interview.model';
import { CustomEncoder } from '../../shared/custom-encoder';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class InterviewsService {
  private url = `${environment.urlJedu}/`;
  constructor(private http: HttpClient) {
  }

  public create(interview: InterviewModel) {
    const url = this.url + 'interviews/create';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('title', interview.title);
    params = params.append('approximateDate', interview.approximateDate);
    params = params.append('contactBy', interview.contactBy);
    params = params.append('description', interview.description);
    params = params.append('typeInterview', interview.typeInterview);
    return this.http.post(url, params);
  }

  getInterview(): Observable<InterviewModel[]> {
    const url = this.url + 'interviews/list';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<InterviewModel[]>(url, params);
  }

  getById(id: number) {
    const url = this.url + 'interviews/byId';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post(url, params);
  }

  addNewWisher(contact: string, id: number) {
    const url = this.url + 'interviews/addWisher';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('interviewId', String(id));
    params = params.append('contact', contact);
    return this.http.post(url, params);
  }

  approveWisher(id: number) {
    const url = this.url + 'interviews/approve';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('wisherId', String(id));
    return this.http.post(url, params);
  }
}
