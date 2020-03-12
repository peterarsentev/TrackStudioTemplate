import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { TaskModel } from '../models/task.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class TasksService {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  getTasks(): Observable<{tasks: TaskModel[]}> {
    const projectId = localStorage.getItem('defaultProjectId');
    const sessionId = localStorage.getItem('sessionId');
    if (!projectId || !sessionId) {
      return this.authService.getDefaultProjectId()
        .pipe(
          switchMap(res => {
            return this.getTaskByProjectId(res.user.defaultProjectId, localStorage.getItem('sessionId'))
          })
        );
    } else {
      return this.getTaskByProjectId(projectId, sessionId);
    }
  }

  getTaskByProjectId(projectId: string, sessionId = localStorage.getItem('sessionId')): Observable<{tasks: TaskModel[]}> {
    let params = new HttpParams();
    params = params.append('action', 'tasks');
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', projectId);
    params = params.append('filterId', '1');
    return this.http.post<{tasks: TaskModel[]}>(`${environment.url}/rest/task`, params)
      .pipe(catchError(err => {
        localStorage.clear();
        this.router.navigate(['/login']);
        throw err;
      }));
  }

  getTask(taskId: string, action: string): Observable<{task: TaskModel}> {
    const url = `${environment.url}/rest/task`;
    let params = new HttpParams();
    params = params.append('action', action);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('filterId', '1');
    return this.http.post<{task: TaskModel}>(url, params)
      .pipe(catchError(err => {
        localStorage.clear();
        this.router.navigate(['/login']);
        throw err;
      }));
  }

  getNavRout(id: string):  Observable<{tasks: TaskModel[]}> {
    id = id ? id : localStorage.getItem('defaultProjectId');
    const url = `${environment.url}/rest/task`;
    let params = new HttpParams();
    params = params.append('action', 'chain');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('fromId', localStorage.getItem('defaultProjectId'));
    params = params.append('toId', id);
    return this.http.post<{tasks: TaskModel[]}>(url, params);
  }

}
