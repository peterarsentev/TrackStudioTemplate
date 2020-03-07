import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class TasksService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getTasks() {
    let projectId = localStorage.getItem('defaultProjectId');
    return this.getTaskByProjectId(projectId);
  }

  getTaskByProjectId(projectId: string) {
    let params = new HttpParams();
    params = params.append('action', 'tasks');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', projectId);
    return this.http.post(`${environment.url}/rest/task`, params);
  }
}
