import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustomEncoder } from '../../shared/custom-encoder';
import { Observable } from 'rxjs';
import { ProjectModel } from './project.model';

@Injectable({providedIn: 'root'})
export class ProjectService {
  private  eduUrl = `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<ProjectModel[]> {
    const url = this.eduUrl + 'project/findList';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<ProjectModel[]>(url, params);
  }

  findById(id: number): Observable<ProjectModel> {
    const url = this.eduUrl + 'project/get';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post<ProjectModel>(url, params);
  }

  addProject(name: string, link: string): Observable<ProjectModel> {
    const url = this.eduUrl + 'project/create';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('name', name);
    params = params.append('link', link);
    return this.http.post<ProjectModel>(url, params);
  }

  update(project: ProjectModel): Observable<ProjectModel> {
    const url = this.eduUrl + 'project/update';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('name', project.name);
    params = params.append('link', project.link);
    params = params.append('id', String(project.id));
    return this.http.post<ProjectModel>(url, params);
  }

  delete(id: number) {
    const url = this.eduUrl + 'project/delete';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post(url, params);
  }
}
