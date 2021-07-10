import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustomEncoder } from '../../shared/custom-encoder';
import { Observable } from 'rxjs';
import { DiscussModel } from '../../shared/models/discuss.model';
import { DiscussSearch } from '../../shared/models/discuss.search';

@Injectable({
  providedIn: 'root'
})
export class DiscussService {
  urlJedu = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) { }

  findAll(page: number): Observable<DiscussModel[]> {
    const url = this.urlJedu + 'discuss/findAll';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('page', String(page));
    return this.http.post<DiscussModel[]>(url, params);
  }

  getById(id: number): Observable<DiscussModel> {
    const url = this.urlJedu + 'discuss/findById';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post<DiscussModel>(url, params);
  }

  search(search: string): Observable<DiscussSearch> {
    const url = this.urlJedu + 'discuss/search';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('search', search);
    return this.http.post<DiscussSearch>(url, params);
  }
}
