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
        this.router.navigate(['/']);
        throw err;
      }));
  }

  getTask(taskId): Observable<{task: TaskModel}> {
    let params = new HttpParams();
    params = params.append('action', 'task');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('filterId', '1');
    return this.http.post<{task: TaskModel}>(`${environment.url}/rest/task`, params);
  }

}
