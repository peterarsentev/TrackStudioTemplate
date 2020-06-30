import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { TaskModel } from '../models/task.model';
import { Router } from '@angular/router';
import { ResponseModel } from '../models/response.model';
import { MStatusesModel } from '../models/m.statuses.model';
import { ButtonCommentModel } from '../models/button.comment.model';
import { MessagesModel } from '../models/messages.model';
import { UserModels } from '../models/user.models';
import { EmergencyModel } from '../models/emergency.model';
import { PreviousNextNavModels } from '../models/previous.next.nav.models';
import { ResponseRatingModel } from '../models/response.rating.model';
import {OutputModel} from '../models/output.model';
import {CustomEncoder} from '../custom-encoder';

@Injectable({providedIn: 'root'})
export class TasksService {

  private allTasksGeneral = '4028808a1953022d0119537e664c0335';
  private allTasks = '0873958f665da72301665dcdf8c4032a';
  private solvedTasks = '0873958f665da72301665dce8608034b';
  private url = `${environment.url}/rest/task/`;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  getTasks(): Observable<{tasks: ResponseModel[]}> {
    const projectId = localStorage.getItem('defaultProjectId');
    const sessionId = localStorage.getItem('sessionId');
    if (!projectId || !sessionId) {
      return this.authService.getDefaultProjectId()
        .pipe(
          switchMap(res => {
            return this.getTaskByProjectId(res.user.defaultProjectId, localStorage.getItem('sessionId'));
          })
        );
    } else {
      return this.getTaskByProjectId(projectId, sessionId);
    }
  }

  getTaskByProjectId(projectId: string, sessionId = localStorage.getItem('sessionId'), filterId?: string): Observable<{tasks: ResponseModel[]}> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', projectId);
    if (projectId === 'ae84b50d571fe2340157387103bd1a68') {
       // Загрузка папки критики. тут нужен фильтр только открыте задачи
       filterId = '4028808a1953022d0119535da2c901cc';
    }
    params = filterId ? params.append('filterId', filterId) : params.append('filterId', '1');
    return this.http.post<{tasks: ResponseModel[]}>(this.url + 'tasks', params)
      .pipe(catchError(err => {
        return this.authService.getDefaultProjectId().pipe(
          switchMap(() => this.getTaskByProjectId(projectId, localStorage.getItem('sessionId')))
        );
      }));
  }

  getTaskByProjectIdLimit(filterId: string, limit: string, offset: string): Observable<{tasks: ResponseModel[]}> {
    const projectId = localStorage.getItem('defaultProjectId');
    const sessionId = localStorage.getItem('sessionId');
    if (!!projectId && !!sessionId) {
      let params = new HttpParams({encoder: new CustomEncoder()});
      params = params.append('sessionId', sessionId);
      params = params.append('taskId', projectId);
      params = params.append('filterId', filterId);
      params = params.append('limit', limit);
      params = params.append('offset', offset);
      return this.http.post<{ tasks: ResponseModel[] }>(this.url + 'page', params);
    } else {
      return this.authService.getDefaultProjectId().pipe(
        switchMap(() => this.getTaskByProjectIdLimit(filterId, limit, offset))
      );
    }
  }

  runCode(code: string) {
    const sessionId = localStorage.getItem('sessionId');
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    params = params.append('code', code);
    const url = `https://job4j.ru/jedu/code/run`;
    return this.http.post<OutputModel>(url, params);
  }

  getTask(taskId: string, action: string, filterId?: string): Observable<ResponseModel> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = filterId ? params.append('filterId', filterId) : params;
    return this.http.post<ResponseModel>(this.url + action, params)
      .pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.router.navigate(['/taskNotFound'], {});
          return EMPTY;
        }
        if (err.status === 403) {
          this.router.navigate(['/taskAccess'], {});
          return EMPTY;
        }
        if (err.status === 500) {
          this.router.navigate(['/error'], {});
          return EMPTY;
        }
        localStorage.clear();
        return this.authService.getDefaultProjectId().pipe(
          switchMap(() => this.getTask(taskId, action, filterId))
        );
      }));
  }

  getNavRout(id?: string): Observable<{tasks: TaskModel[]}> {
    id = id ? id : localStorage.getItem('defaultProjectId');
    const sessionId =  localStorage.getItem('sessionId');
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    params = params.append('toId', id);
    if (!!id && !!sessionId) {
      return this.http.post<{ tasks: TaskModel[] }>(this.url + 'chain', params)
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
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    if (!!sessionId) {
      params = params.append('sessionId', sessionId);
      params = params.append('taskId', taskId);
      params = params.append('filterId', general ? this.allTasksGeneral : all ? this.allTasks : this.solvedTasks);
      return this.http.post<{ [total: string]: number }>(this.url + 'size', params);
    } else {
      return this.authService.getDefaultProjectId()
        .pipe(switchMap(() => this.getTaskCount(taskId, all, general)
        ));
    }
  }

  getButtons(projectId: string, sessionId = localStorage.getItem('sessionId')): Observable<{mstatuses: MStatusesModel[]}> {
    let params = new HttpParams();
    projectId = projectId ? projectId : localStorage.getItem('defaultProjectId');
    // params = params.append('action', 'categories');
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', projectId);
    return this.http.post<{mstatuses: MStatusesModel[]}>(this.url + 'categories', params)
      .pipe(catchError(err => {
        return this.authService.getDefaultProjectId().pipe(
          switchMap(() => this.getButtons(projectId, localStorage.getItem('sessionId')))
        );
      }));
  }

  getMessages(taskId: string): Observable<{ messages: MessagesModel[] }> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('action', 'messages');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    return this.http.post<{ messages: MessagesModel[] }>(this.url + 'messages', params);
  }

  getButtonsForTask(taskId: string): Observable<{ mstatuses: ButtonCommentModel[] }> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    return this.http.post<{mstatuses: ButtonCommentModel[]}>(this.url + 'mstatus', params);
  }

  gerResponsiblePeople(taskId: string, mstatusId: string): Observable<{ handlers: UserModels[] }> {
    const url = `${environment.url}/rest/message`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('mstatusId', mstatusId);
    return this.http.post<{ handlers: UserModels[] }>(url + '/handlers', params);
  }

  getResponsePersonsForTask(taskId: string, categoryId: string): Observable<{ handlers: UserModels[] }>  {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('categoryId', categoryId);
    return this.http.post<{ handlers: UserModels[] }>(this.url + 'handlers', params);
  }

  sendComment(taskId: string, mstatusId: string, handlerId: string, description: string) {
    const url = `${environment.url}/rest/message`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('mstatusId', mstatusId);
    params = params.append('handlerId', handlerId);
    params = params.append('description', description);
    return this.http.post<any>(url + '/create', params);
  }

  createTask(parentId: string, categoryId: string, name: string, description: string) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('parentId', parentId);
    params = params.append('categoryId', categoryId);
    params = params.append('name', name);
    params = params.append('description', description);
    return this.http.post<{ task: TaskModel }>(this.url + 'create', params);
  }

  getEmergencyMessage(): Observable<{ emergency: EmergencyModel[] }> {
    let params = new HttpParams();
    // params = params.append('action', 'emergency');
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    if (!!sessionId) {
      return this.http.post<{ emergency: EmergencyModel[]; }>(this.url + 'emergency', params);
    } else {
      return this.authService.getDefaultProjectId().pipe(
        switchMap(() => this.getEmergencyMessage())
      );
    }
  }

  getNextAndPreviousTasks(taskId: string): Observable<PreviousNextNavModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('action', 'iterator');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('parentId', localStorage.getItem('defaultProjectId'));
    params = params.append('filterId', '4028808a1953022d0119537e664c0335');
    params = params.append('taskId', taskId);
    return this.http.post<PreviousNextNavModels>(this.url + 'iterator', params);
  }

  getRate(shortname: string): Observable<ResponseRatingModel> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('number', shortname);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = `https://job4j.ru/jedu/ratetask/get`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  voteUp(shortname: string) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('number', shortname);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = `https://job4j.ru/jedu/ratetask/upOn`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  voteClear(shortname: string) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('number', shortname);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = `https://job4j.ru/jedu/ratetask/off`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  voteDown(shortname: string) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('number', shortname);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = `https://job4j.ru/jedu/ratetask/downOn`;
    return this.http.post<ResponseRatingModel>(url, params);
  }
}
