import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, delay, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, throwError } from 'rxjs';
import { TaskModel } from '../models/task.model';
import { Router } from '@angular/router';
import { ResponseModel } from '../models/response.model';
import { MStatusesModel } from '../models/m.statuses.model';
import { ButtonCommentModel } from '../models/button.comment.model';
import { MessagesModel } from '../models/messages.model';
import { UserModels } from '../models/user.models';

@Injectable({providedIn: 'root'})
export class TasksService {

  private allTasks = '0873958f665da72301665dcdf8c4032a';
  private solvedTasks = '0873958f665da72301665dce8608034b';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  getTasks(): Observable<{tasks: ResponseModel[]}> {
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

  getTaskByProjectId(projectId: string, sessionId = localStorage.getItem('sessionId')): Observable<{tasks: ResponseModel[]}> {
    let params = new HttpParams();
    params = params.append('action', 'tasks');
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', projectId);
    params = params.append('filterId', '1');
    return this.http.post<{tasks: ResponseModel[]}>(`${environment.url}/rest/task`, params)
      .pipe(catchError(err => {
        return this.authService.getDefaultProjectId().pipe(
          switchMap(() => this.getTaskByProjectId(projectId, localStorage.getItem('sessionId')))
        );
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
        return this.authService.getDefaultProjectId().pipe(
          switchMap(() => this.getTask(taskId, action))
        );
      }));
  }

  getNavRout(id?: string):  Observable<{tasks: TaskModel[]}> {
    id = id ? id : localStorage.getItem('defaultProjectId');
    const url = `${environment.url}/rest/task`;
    let params = new HttpParams();
    params = params.append('action', 'chain');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('toId', id);
    return this.http.post<{tasks: TaskModel[]}>(url, params)
      .pipe(
        catchError(() => {
          localStorage.clear();
          return  this.getTasks().pipe(
            switchMap(() => this.getNavRout(id))
          );
        })
      );
  }

  getTaskCount(taskId: string, all: boolean): Observable<{ [total: string]: number }> {
    const url = `${environment.url}/rest/task`;
    let params = new HttpParams();
    params = params.append('action', 'size');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('filterId', all ? this.allTasks : this.solvedTasks);
    return this.http.post<{ [total: string]: number }>(url, params)
      .pipe(catchError(err => {
        throw null;
      }));
  }

  getButtons(projectId: string, sessionId = localStorage.getItem('sessionId')): Observable<{mstatuses: MStatusesModel[]}> {
    let params = new HttpParams();
    projectId = projectId ? projectId : localStorage.getItem('defaultProjectId');
    params = params.append('action', 'categories');
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', projectId);
    return this.http.post<{mstatuses: MStatusesModel[]}>(`${environment.url}/rest/task`, params)
      .pipe(catchError(err => {
        return this.authService.getDefaultProjectId().pipe(
          switchMap(() => this.getButtons(projectId, localStorage.getItem('sessionId')))
        );
      }));
  }

  getMessages(taskId: string): Observable<{ messages: MessagesModel[] }> {
    let params = new HttpParams();
    params = params.append('action', 'messages');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    return this.http.post<{ messages: MessagesModel[] }>(`${environment.url}/rest/task`, params);
  }

  getButtonsForTask(taskId: string): Observable<{ mstatuses: ButtonCommentModel[] }> {
    let params = new HttpParams();
    params = params.append('action', 'mstatus');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    return this.http.post<{mstatuses: ButtonCommentModel[]}>(`${environment.url}/rest/task`, params);
  }

  gerResponsiblePeople(taskId: string, mstatusId: string): Observable<{ handlers: UserModels[] }> {
    const url = `${environment.url}/rest/message`;
    let params = new HttpParams();
    params = params.append('action', 'handlers');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('mstatusId', mstatusId);
    return this.http.post<{ handlers: UserModels[] }>(url, params);
  }

  sendComment(taskId: string, mstatusId: string, handlerId: string, description: string) {
    const url = `${environment.url}/rest/message`;
    let params = new HttpParams();
    params = params.append('action', 'create');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('mstatusId', mstatusId);
    params = params.append('handlerId', handlerId);
    params = params.append('description', description);
    return this.http.post<any>(url, params);
  }

}
