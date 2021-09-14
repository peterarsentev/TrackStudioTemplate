import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CustomEncoder } from '../../../shared/custom-encoder';
import { Observable } from 'rxjs';
import { RatingResponse } from '../../../shared/models/rating.response';

@Injectable({providedIn: 'root'})
export class RatingService {
  urlJedu = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {
  }

  getRating(page: number): Observable<RatingResponse> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('page', String(page));
    return this.http.post<RatingResponse>(this.urlJedu + 'activity/rating', params);
  }

  getRowPosition(): Observable<{ 'row': number }> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<{'row': number}>(this.urlJedu + 'activity/rowRating', params);
  }
}
