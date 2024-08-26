import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomEncoder } from '../custom-encoder';
import { Observable } from 'rxjs';
import { TopicModels } from '../models/topic.models';
import { TaskCodeModel } from '../models/task.code.models';
import { SolutionTaskCodeModels } from '../models/solution.task.code.models';
import { SolutionModels } from '../models/solution.models';
import {environment} from '../../../environments/environment';
import { SolutionsModel } from '../models/solutions.model';

@Injectable({
  providedIn: 'root'
})
export class TaskCodeService {
  urlJedu = `${environment.urlJedu}/`;

  constructor(private http: HttpClient) { }

  exercises(): Observable<TopicModels[]> {
    const url = this.urlJedu + 'taskcode/exercises';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<TopicModels[]>(url, params);
  }

  getTaskCodeByTopicId(id: string): Observable<TaskCodeModel[]> {
    const url = this.urlJedu + 'taskcode/topic';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('topicId', id);
    return this.http.post<TaskCodeModel[]>(url, params);
  }

  getTasksWithStatus(id: string, value?: string) {
    const url = this.urlJedu + 'taskcode/solutions';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', id);
    params = value ? params.append('complexity', value) : params;
    return this.http.post<TaskCodeModel[]>(url, params);
  }

  getNewTask(taskId: string): Observable<TaskCodeModel> {
    const url = this.urlJedu + 'taskcode/get';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', taskId);
    return this.http.post<TaskCodeModel>(url, params);
  }

  startTask(taskId: string): Observable<SolutionModels> {
    const url = this.urlJedu + 'taskcode/start';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskCodeId', taskId);
    return this.http.post<SolutionModels>(url, params);
  }

  getTaskAndSolution(taskCodeId: string, solutionId: string): Observable<SolutionTaskCodeModels> {
    const url = this.urlJedu + 'taskcode/solution';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskCodeId', taskCodeId);
    params = params.append('solutionId', solutionId);
    return this.http.post<SolutionTaskCodeModels>(url, params);
  }

  getSolution(solutionId: number): Observable<SolutionTaskCodeModels> {
    const url = this.urlJedu + 'taskcode/solution';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('solutionId', String(solutionId));
    return this.http.post<SolutionTaskCodeModels>(url, params);
  }

  submitSolution(solution: SolutionModels): Observable<{ output: string, status: number }> {
    const url = this.urlJedu + 'taskcode/submit';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskCodeId', String(solution.taskCodeId));
    params = params.append('solutionId', String(solution.id));
    params = params.append('tsUserId', solution.tsUserId);
    params = params.append('code', solution.code);
    params = params.append('createdTime', String(solution.createdTime));
    params = params.append('statusId', String(solution.statusId));
    return this.http.post<{ output: string, status: number }>(url, params);
  }

  total(): Observable<{ [total: string]: number }> {
    const params = new HttpParams({encoder: new CustomEncoder()});
    return this.http.post<{ [total: string]: number }>(this.urlJedu + 'taskcode/total', params);
  }

  reset(solutionId: string) {
    const url = this.urlJedu + 'taskcode/reset';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('solutionId', solutionId);
    return this.http.post(url, params);
  }

  countSolutions(taskId: string): Observable<{ count: number }> {
    const url = this.urlJedu + 'taskcode/countSolutions';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskId);
    return this.http.post<{ count: number }>(url, params);
  }

  getSolutionsByTaskId(page: number, taskId: number) {
    const url = this.urlJedu + 'taskcode/getByTaskId';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('page', String(page));
    params = params.append('taskId', String(taskId));
    return this.http.post<SolutionsModel[]>(url, params);
  }

  getSolutionByUserId(taskCodeId: any, userId: any): Observable<SolutionTaskCodeModels> {
    const url = this.urlJedu + 'taskcode/getByUserAndTaskId';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('taskId', taskCodeId);
    params = params.append('userId', userId);
    return this.http.post<SolutionTaskCodeModels>(url, params);
  }

  getTopicById(id: string): Observable<TopicModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', id);
    const url = this.urlJedu + `taskcode/getTopic`;
    return this.http.post<TopicModels>(url, params);
  }
}
