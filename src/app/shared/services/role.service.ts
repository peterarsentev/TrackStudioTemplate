import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CustomEncoder} from '../custom-encoder';
import {RuleModels} from '../models/rule.models';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private url = `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  getRulesForCurrentSession() {
    const url = this.url + `user/permission`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<RuleModels[]>(url, params);
  }
}
