import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CustomEncoder } from '../../../shared/custom-encoder';
import { Observable } from 'rxjs';
import { UserActivityModel } from '../../../shared/models/user.activity.model';

@Injectable({providedIn: 'root'})
export class ChartService {
  urlJedu = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {
  }

  getUserActivity(): Observable<UserActivityModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    return this.http.post<UserActivityModel[]>(this.urlJedu + 'activity/userActivity', params);
  }

  getUserSolvedActivity(): Observable<UserActivityModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    return this.http.post<UserActivityModel[]>(this.urlJedu + 'activity/userSolvedActivity', params);
  }
}

