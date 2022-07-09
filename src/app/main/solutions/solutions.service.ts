import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomEncoder } from '../../shared/custom-encoder';
import { SolutionsModel } from '../../shared/models/solutions.model';
import { Observable } from 'rxjs';
import { Links } from '../../shared/models/links';

@Injectable({providedIn: 'root'})
export class SolutionsService {

  url = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {}

  getSolutionsByTaskId(page: number, taskId: number): Observable<SolutionsModel[]> {
    const url = this.url + 'solution/getByTaskId';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('page', String(page));
    params = params.append('taskId', String(taskId));
    return this.http.post<SolutionsModel[]>(url, params);
  }

  getSolutionsLinks(solutionId: any): Observable<Links> {
    const url = this.url + 'solution/getLinks';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('solutionId', String(solutionId));
    return this.http.post<Links>(url, params);
  }
}
