import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CustomEncoder } from '../../../shared/custom-encoder';
import { InfoModel } from '../../../shared/models/info.model';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class InfoService {
  urlJedu = `${environment.urlJedu}/`;
  constructor(private http: HttpClient) {
  }

  getList(page: number): Observable<InfoModel[]> {
    const url = this.urlJedu + 'info/list';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('page', String(page));
    return this.http.post<InfoModel[]>(url, params);
  }
}
