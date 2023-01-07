import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustomEncoder } from '../custom-encoder';
import { Observable } from 'rxjs';
import { InterviewNotificationModel } from '../models/interview.notification.model';

@Injectable({providedIn: 'root'})
export class InterviewNotificationService {

  urlJedu = `${environment.urlJedu}/`;
  constructor(private http: HttpClient) {
  }

  getCount(): Observable<{ count: number }> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `interviewsNotification/count`;
    return this.http.post<{count: number}>(url, params);
  }

  getAll(): Observable<InterviewNotificationModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `interviewsNotification/list`;
    return this.http.post<InterviewNotificationModel[]>(url, params);
  }

  markAsRead() {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `interviewsNotification/readAll`;
    return this.http.post(url, params);
  }

  deleteAll() {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `interviewsNotification/deleteAll`;
    return this.http.post(url, params);
  }

  delete(id: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    const url = this.urlJedu + `interviewsNotification/delete`;
    return this.http.post(url, params);
  }
}
