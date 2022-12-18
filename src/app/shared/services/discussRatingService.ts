import { Observable } from 'rxjs';
import { ResponseRatingModel } from '../models/response.rating.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomEncoder } from '../custom-encoder';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class DiscussRatingService {

  urlJedu = `${environment.urlJedu}/`;
  constructor(private http: HttpClient) {
  }


  getRate(messageId: number): Observable<ResponseRatingModel> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('messageId', String(messageId));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `ratecomment/get`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  voteUp(discussMessageId: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('messageId', String(discussMessageId));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `ratecomment/upOn`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  voteClear(taskId: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('messageId', String(taskId));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `ratecomment/off`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  voteDown(taskId: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('messageId', String(taskId));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `ratecomment/downOn`;
    return this.http.post<ResponseRatingModel>(url, params);
  }
}
