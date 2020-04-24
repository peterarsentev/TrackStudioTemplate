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
import { EmergencyModel } from '../models/emergency.model';
import { PreviousNextNavModels } from '../models/previous.next.nav.models';

@Injectable({providedIn: 'root'})
export class TasksService {

  private allTasksGeneral = '4028808a1953022d0119537e664c0335';
  private allTasks = '0873958f665da72301665dcdf8c4032a';
  private solvedTasks = '0873958f665da72301665dce8608034b';
  private url = `${environment.url}/rest/task`;

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
    return this.http.post<{tasks: ResponseModel[]}>(this.url, params)
      .pipe(catchError(err => {
        return this.authService.getDefaultProjectId().pipe(
          switchMap(() => this.getTaskByProjectId(projectId, localStorage.getItem('sessionId')))
        );
      }));
  }

  getTask(taskId: string, action: string, filterId?: string): Observable<{task: TaskModel}> {
    let params = new HttpParams();
    params = params.append('action', action);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = filterId ? params.append('filterId', filterId) : params;
    return this.http.post<{task: TaskModel}>(this.url, params)
      .pipe(catchError(err => {
        localStorage.clear();
        return this.authService.getDefaultProjectId().pipe(
          switchMap(() => this.getTask(taskId, action, filterId))
        );
      }));
  }

  getNavRout(id?: string):  Observable<{tasks: TaskModel[]}> {
    id = id ? id : localStorage.getItem('defaultProjectId');
    const sessionId =  localStorage.getItem('sessionId');
    let params = new HttpParams();
    params = params.append('action', 'chain');
    params = params.append('sessionId', sessionId);
    params = params.append('toId', id);
    if (!!id && !!sessionId) {
      return this.http.post<{ tasks: TaskModel[] }>(this.url, params)
        .pipe(
          catchError(() => {
            localStorage.clear();
            return this.getTasks().pipe(
              switchMap(() => this.getNavRout(id))
            );
          })
        );
    } else {
      return this.authService.getDefaultProjectId().pipe(
        switchMap(() => this.getNavRout(id))
      );
    }
  }

  getTaskCount(taskId: string, all: boolean, general: boolean): Observable<{ [total: string]: number }> {
    let params = new HttpParams();
    params = params.append('action', 'size');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('filterId', general ? this.allTasksGeneral : all ? this.allTasks : this.solvedTasks);
    return this.http.post<{ [total: string]: number }>(this.url, params)
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
    return this.http.post<{mstatuses: MStatusesModel[]}>(this.url, params)
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
    return this.http.post<{ messages: MessagesModel[] }>(this.url, params);
  }

  getButtonsForTask(taskId: string): Observable<{ mstatuses: ButtonCommentModel[] }> {
    let params = new HttpParams();
    params = params.append('action', 'mstatus');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    return this.http.post<{mstatuses: ButtonCommentModel[]}>(this.url, params);
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

  getResponsePersonsForTask(taskId: string, categoryId: string): Observable<{ handlers: UserModels[] }>  {
    let params = new HttpParams();
    params = params.append('action', 'handlers');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('categoryId', categoryId);
    return this.http.post<{ handlers: UserModels[] }>(this.url, params);
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

  createTask(parentId: string, categoryId: string, name: string, description: string) {
    let params = new HttpParams();
    params = params.append('action', 'create');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('parentId', parentId);
    params = params.append('categoryId', categoryId);
    params = params.append('name', name);
    params = params.append('description', description);
    return this.http.post<{ handlers: UserModels[] }>(this.url, params);
  }

  getEmergencyMessage(): Observable<{ emergency: EmergencyModel[] }> {
    let params = new HttpParams();
    params = params.append('action', 'emergency');
    let sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    if (!!sessionId) {
      return this.http.post<{ emergency: EmergencyModel[]; }>(this.url, params);
    } else {
      return this.authService.getDefaultProjectId().pipe(
        switchMap(() => this.getEmergencyMessage())
      )
    }
  }

  /*
  curl http://localhost:8080/TrackStudio/rest/task
  -d action=iterator
  -d sessionId=df0aa0468c1af32f00612aa3486f8d70
  -d parentId=1
  -d filterId=4028808a1953022d0119537e664c0335
  -d taskId=4028808a1953022d0119537bdcc2032e

parentId = Это defaultProjectId
filterId = 4028808a1953022d0119537e664c0335 - зашит жестко.
taskId = это текущая задача.
ответ previous next - Это id задачи. На форму задаче выводитм две ссылки предыдущая - следующая. Вид самый примитивный.
   */
  getNextAndPreviousTasks(taskId: string): Observable<PreviousNextNavModels> {
    let params = new HttpParams();
    params = params.append('action', 'iterator');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('parentId', localStorage.getItem('defaultProjectId'));
    params = params.append('filterId', '4028808a1953022d0119537e664c0335');
    params = params.append('taskId', taskId);
    return this.http.post<PreviousNextNavModels>(this.url, params);
  }
}
