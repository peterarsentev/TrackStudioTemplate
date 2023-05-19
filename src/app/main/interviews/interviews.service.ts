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

  getById(id: number): Observable<InterviewModel> {
    const url = this.url + 'interviews/byId';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post<InterviewModel>(url, params);
  }

  getByIdForUpdate(id: number): Observable<InterviewModel> {
    const url = this.url + 'interviews/byIdForUpdate';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post<InterviewModel>(url, params);
  }

  addNewWisher(contact: string, id: number) {
    const url = this.url + 'interviews/addWisher';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('interviewId', String(id));
    params = params.append('contact', contact);
    return this.http.post(url, params);
  }

  approveWisher(id: number, interviewId: number) {
    const url = this.url + 'interviews/approve';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('wisherId', String(id));
    params = params.append('interviewId', String(interviewId));
    return this.http.post(url, params);
  }

  check(): Observable<{ canCreate: boolean, id: number }> {
    const url = this.url + 'interviews/canCreate';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<{ canCreate: boolean, id: number }>(url, params);
  }

  sendReview(id: number, score: string, comment: string) {
    const url = this.url + 'interviews/review';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    params = params.append('score', String(score));
    params = params.append('comment', String(comment));
    return this.http.post(url, params);
  }

  cancel(id: number) {
    const url = this.url + 'interviews/cancel';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post(url, params);
  }

  public update(interview: InterviewModel) {
    const url = this.url + 'interviews/update';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('title', interview.title);
    params = params.append('approximateDate', interview.approximateDate);
    params = params.append('contactBy', interview.contactBy);
    params = params.append('description', interview.description);
    params = params.append('typeInterview', interview.typeInterview);
    params = params.append('id', String(interview.id));
    return this.http.post(url, params);
  }
}
