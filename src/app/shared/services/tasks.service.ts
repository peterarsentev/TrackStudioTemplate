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
import { OutputModel } from '../models/output.model';
import { CustomEncoder } from '../custom-encoder';
import { SolvedAllCountModels } from '../models/solved.all.count.models';
import { NavNode } from '../models/nav.node';
import { NextPreviousSolutions } from '../models/nextPreviousSolutions';
import { CountModels } from '../models/countModels';
import { TopicModels } from '../models/topic.models';
import { TaskTopicModel } from '../models/task.topic.model';
import { UserEduModels } from '../models/userEduModels';
import { LevelModels } from '../models/level.models';
import { CategoryModels } from '../models/category.models';
import { TopicFilterModels } from '../models/topicFilterModels';
import { TopicFilter } from '../models/topickFilter';
import { MessageModel } from '../models/message.model';
import { NextNavModels } from '../models/next.nav.models';
import { PageModel } from '../models/page.model';
import {RecentlySolvedModels} from '../models/recently-solved-models';


@Injectable({providedIn: 'root'})
export class TasksService {

  private url = `${environment.url}/rest/task/`;
  urlJedu = `${environment.url}/`;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  getTasks(): Observable<{ tasks: ResponseModel[] }> {
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

  getTaskByProjectId(projectId: string,
                     sessionId = localStorage.getItem('sessionId'),
                     filterId?: string): Observable<{ tasks: ResponseModel[] }> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', projectId);
    if (projectId === 'ae84b50d571fe2340157387103bd1a68') {
      // Загрузка папки критики. тут нужен фильтр только открыте задачи
      filterId = '4028808a1953022d0119535da2c901cc';
    }
    params = filterId ? params.append('filterId', filterId) : params.append('filterId', '1');
    return this.http.post<{ tasks: ResponseModel[] }>(this.url + 'tasks', params)
      .pipe(catchError(err => {
        return this.authService.getDefaultProjectId().pipe(
          switchMap((res) =>
            this.getTaskByProjectId(res.user.defaultProjectId, localStorage.getItem('sessionId')))
        );
      }));
  }

  getTaskByProjectIdLimit(filterId: string, limit: string, offset: string): Observable<{ tasks: ResponseModel[] }> {
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

  runJava(code: string) {
    const sessionId = localStorage.getItem('sessionId');
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    params = params.append('code', code);
    const url = this.urlJedu + `code/run`;
    return this.http.post<OutputModel>(url, params);
  }

  runSql(scripts: string) {
    const sessionId = localStorage.getItem('sessionId');
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    params = params.append('scripts', scripts);
    const url = this.urlJedu + `sqlSandBox/run`;
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

  // getNavRout(id?: string): Observable<{tasks: TaskModel[]}> {
  //   id = id ? id : localStorage.getItem('defaultProjectId');
  //   const sessionId =  localStorage.getItem('sessionId');
  //   let params = new HttpParams({encoder: new CustomEncoder()});
  //   params = params.append('sessionId', sessionId);
  //   params = params.append('toId', id);
  //   if (!!id && !!sessionId) {
  //     return this.http.post<{ tasks: TaskModel[] }>(this.url + 'chain', params)
  //       .pipe(
  //         catchError(() => {
  //           localStorage.clear();
  //           return this.getTasks().pipe(
  //             switchMap(() => this.getNavRout(id))
  //           );
  //         })
  //       );
  //   } else {
  //     return this.authService.getDefaultProjectId().pipe(
  //       switchMap(() => this.getNavRout(id))
  //     );
  //   }
  // }

  getTaskCount(taskId: string, all: boolean, general: boolean): Observable<{ [total: string]: number }> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    if (!!sessionId && !!taskId) {
      params = params.append('sessionId', sessionId);
      return this.http.post<{ [total: string]: number }>(this.url + 'size', params);
    }
    // } else {
    //   return this.authService.getDefaultProjectId()
    //     .pipe(switchMap(() => this.getTaskCount(taskId, all, general)
    //     ));
    // }
  }

  getCountTasks(userId?: number): Observable<CountModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = userId ?  params.append('userId', String(userId)) : params;
    return this.http.post<CountModels>(this.urlJedu + 'task/countTasks', params);
  }

  getCountTasksByStartedAt(userId?: number): Observable<CountModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = userId ?  params.append('userId', String(userId)) : params;
    return this.http.post<CountModels>(this.urlJedu + 'task/countTasksByStartedAt', params);
  }

  getCountTasksByLevel(levelId: number, userId: number): Observable<CountModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('levelId', String(levelId));
    params = userId ? params.append('userId', String(userId)) : params;
    return this.http.post<CountModels>(this.urlJedu + 'task/countTaskByLevel', params);
  }

  getButtons(projectId: string, sessionId = localStorage.getItem('sessionId')): Observable<{ mstatuses: MStatusesModel[] }> {
    let params = new HttpParams();
    projectId = projectId ? projectId : localStorage.getItem('defaultProjectId');
    // params = params.append('action', 'categories');
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', projectId);
    return this.http.post<{ mstatuses: MStatusesModel[] }>(this.url + 'categories', params);
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
    return this.http.post<{ mstatuses: ButtonCommentModel[] }>(this.url + 'mstatus', params);
  }

  gerResponsiblePeople(taskId: string, mstatusId: string): Observable<{ handlers: UserModels[] }> {
    const url = `${environment.url}/rest/message`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    params = params.append('mstatusId', mstatusId);
    return this.http.post<{ handlers: UserModels[] }>(url + '/handlers', params);
  }

  getResponsePersonsForTask(taskId: string, categoryId: string): Observable<{ handlers: UserModels[] }> {
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

  getRate(taskId: number): Observable<ResponseRatingModel> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('taskId', String(taskId));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `ratetask/get`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  voteUp(taskId: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('taskId', String(taskId));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `ratetask/upOn`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  voteClear(taskId: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('taskId', String(taskId));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `ratetask/off`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  voteDown(taskId: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('taskId', String(taskId));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `ratetask/downOn`;
    return this.http.post<ResponseRatingModel>(url, params);
  }

  getSolvedAndAllProgress(topicId: string): Observable<SolvedAllCountModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', topicId);
    const url = this.urlJedu + `taskcode/progress`;
    return this.http.post<SolvedAllCountModels>(url, params);
  }

  getNavsForSolutions(topicId?: string, taskCodeId?: string): Observable<NavNode[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = topicId ? params.append('topicId', topicId) : params;
    params = taskCodeId ? params.append('taskCodeId', taskCodeId) : params;
    const url = this.urlJedu + `taskcode/breadcrumbs`;
    return this.http.post<NavNode[]>(url, params);
  }

  getNavsForTasks(topicId?: string, taskId?: string): Observable<NavNode[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = topicId ? params.append('topicId', topicId) : params;
    params = taskId ? params.append('taskId', taskId) : params;
    const url = this.urlJedu + `task/breadcrumbs`;
    return this.http.post<NavNode[]>(url, params);
  }

  getNavsForDiscuss(discussId?: string, list?: string): Observable<NavNode[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = discussId ? params.append('discussId', discussId) : params;
    params = list ? params.append('list', list) : params;
    const url = this.urlJedu + `discuss/breadcrumbs`;
    return this.http.post<NavNode[]>(url, params);
  }

  getNextPreviousSol(taskCodeId: string): Observable<NextPreviousSolutions> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskCodeId', taskCodeId);
    const url = this.urlJedu + `taskcode/nextPrevious`;
    return this.http.post<NextPreviousSolutions>(url, params);
  }

  getSolvedAndAllExerciseCount(userId?: number): Observable<CountModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = userId ? params.append('userId', String(userId)) : params;
    const url = this.urlJedu + `taskcode/countTasks`;
    return this.http.post<CountModels>(url, params);
  }

  getTasksTopicsList(): Observable<TopicModels[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `task/topic`;
    return this.http.post<TopicModels[]>(url, params);
  }

  getTasksByTopicId(id: string): Observable<TaskTopicModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', id);
    const url = this.urlJedu + `task/tasksByTopicId`;
    return this.http.post<TaskTopicModel[]>(url, params)
      .pipe(
        catchError(() => {
          this.router.navigate(['/login']);
          return EMPTY;
        })
      );
  }

  getTasksByUpdate(page: number): Observable<PageModel<TaskTopicModel[]>> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `task/by_update_date`;
    params = params.append('page', String(page));
    return this.http.post<PageModel<TaskTopicModel[]>>(url, params);
  }

  getTaskById(id: string): Observable<TaskTopicModel> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', id);
    const url = this.urlJedu + `task/task`;
    return this.http.post<TaskTopicModel>(url, params);
  }

  getTopicById(id: string): Observable<TopicModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', id);
    const url = this.urlJedu + `topic/get`;
    return this.http.post<TopicModels>(url, params);
  }

  getHandlers(): Observable<UserEduModels[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `user/handlers`;
    return this.http.post<UserEduModels[]>(url, params);
  }

  createSolutionAndAddComment(taskId: number, operationId: number, handlerId: string, description: string)
    : Observable<{ solutionId: number }> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', String(taskId));
    params = params.append('operationId', String(operationId));
    params = params.append('handlerId', String(handlerId));
    params = params.append('description', description);
    const url = this.urlJedu + `solution/create`;
    return this.http.post<{ solutionId: number }>(url, params);
  }

  updateSolutionAndAddComment(taskId: number, solutionId: number, operationId: number, handlerId: string, description: string) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', String(taskId));
    params = params.append('solutionId', String(solutionId));
    params = params.append('operationId', String(operationId));
    params = params.append('handlerId', String(handlerId));
    params = params.append('description', description);
    const url = this.urlJedu + `solution/update`;
    return this.http.post(url, params);
  }

  getOperations(id: number): Observable<MessagesModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('solutionId', String(id));
    const url = this.urlJedu + `solution/operations`;
    return this.http.post<MessagesModel[]>(url, params);
  }

  getTasksByStatus(page: number, status: string): Observable<TaskTopicModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + `task/byStatus`;
    params = params.append('page', String(page));
    params = params.append('status', status);
    return this.http.post<TaskTopicModel[]>(url, params);
  }


  getVerifiedTasks(userId?: number): Observable<TaskTopicModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = userId ? params.append('userId', String(userId)) : params;
    const url = this.urlJedu + `task/verified`;
    return this.http.post<TaskTopicModel[]>(url, params);
  }

  getSolvedTasks(userid?: number): Observable<TaskTopicModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = userid ? params.append('userId', String(userid)) : params;
    const url = this.urlJedu + `task/solved`;
    return this.http.post<TaskTopicModel[]>(url, params);
  }

  getNewTasks(userId?: number): Observable<TaskTopicModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = userId ? params.append('userId', String(userId)) : params;
    const url = this.urlJedu + `task/newTasks`;
    return this.http.post<TaskTopicModel[]>(url, params);
  }

  getSolvedAndAllProgressTasks(topicId: string): Observable<SolvedAllCountModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', topicId);
    const url = this.urlJedu + `task/progress`;
    return this.http.post<SolvedAllCountModels>(url, params);
  }

  getTasksBySearch(search: string) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('search', search);
    const url = this.urlJedu + `task/tasksBySearch`;
    return this.http.post<TaskTopicModel[]>(url, params)
      .pipe(
        catchError(() => {
          this.router.navigate(['/login']);
          return EMPTY;
        })
      );
  }

  getLevels(userId?: number): Observable<LevelModels[]> {
    const url = this.urlJedu + 'level/getByPermission';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = userId ? params.append('userId', String(userId)) : params;
    return this.http.post<LevelModels[]>(url, params);
  }

  getCategoriesByLevel(id: number): Observable<CategoryModels[]> {
    const url = this.urlJedu + 'category/getByLevel';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('levelId', String(id));
    return this.http.post<CategoryModels[]>(url, params);
  }

  getUserFilters(): Observable<TopicFilterModels> {
    const url = this.urlJedu + 'filterTopic/get';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<TopicFilterModels>(url, params);
  }

  getCategories(): Observable<CategoryModels[]> {
    const url = this.urlJedu + 'category/all';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<CategoryModels[]>(url, params);
  }

  saveFilter(key: number, value: number): Observable<TopicFilter> {
    const url = this.urlJedu + 'filterTopic/add';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('key', String(key));
    params = params.append('value', String(value));
    return this.http.post<TopicFilter>(url, params);
  }

  deleteTopicFilter(id: number) {
    const url = this.urlJedu + 'filterTopic/delete';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post(url, params);
  }

  updateOperation(message: MessagesModel, newText: string, taskId: number): Observable<MessageModel> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('messageId', String(message.message.id));
    params = params.append('taskId', String(taskId));
    params = params.append('text', newText);
    const url = this.urlJedu + `task/updateOperation`;
    return this.http.post<MessageModel>(url, params);
  }

  getSolutionsCount(id: number) {
    const url = this.urlJedu + 'solution/getSolutionsCount';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', String(id));
    return this.http.post<{totalCount: number}>(url, params);
  }

  getTaskTime(taskId) {
    const url = this.urlJedu + 'time/task';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', String(taskId));
    return this.http.post<{second: number}>(url, params);
  }

  getNextAndPreviousTopic(topicId: number): Observable<NextNavModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', String(topicId));
    return this.http.post<NextNavModels>(this.urlJedu + 'task/nextAndPrevious', params);
  }

  setNewFilters(levelId: number, categoryId?: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('levelId', String(levelId));
    params = categoryId ? params.append('categoryId', String(categoryId)) : params;
    return this.http.post<any>(this.urlJedu + 'filterTopic/newFilters', params);
  }

  getRecentlySolved(taskId: number) {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', String(taskId));
    return this.http.post<RecentlySolvedModels[]>(this.urlJedu + 'task/recentlySolved', params);
  }
}
