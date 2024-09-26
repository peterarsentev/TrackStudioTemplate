import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomEncoder} from '../custom-encoder';
import {TaskExerciseModel} from '../models/task.exercise.model';
import {TaskExerciseSolutionModel} from '../models/task.exercise.solution.model';

@Injectable({
  providedIn: 'root'
})
export class TaskExerciseSolutionService {

  private urlServer =  `${environment.url}/`;
  constructor(private http: HttpClient) {
  }

  getByTaskId(taskId: number): Observable<TaskExerciseSolutionModel> {
    const url = this.urlServer + 'taskExerciseSolution/get';
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', String(taskId));
    return this.http.post<TaskExerciseSolutionModel>(url, params);
  }

  runJava(solution: TaskExerciseSolutionModel, taskId: number): Observable<TaskExerciseSolutionModel> {
    const url = this.urlServer + 'taskExerciseSolution/run';
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', String(taskId));
    params = params.append('code', solution.code);
    params = params.append('id', String(solution.id));
    return this.http.post<TaskExerciseSolutionModel>(url, params);
  }
}
