import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomEncoder} from '../custom-encoder';
import {TaskExerciseModel} from '../models/task.exercise.model';

@Injectable({
  providedIn: 'root'
})
export class TaskExerciseService {

  private urlServer =  `${environment.url}/`;
  constructor(private http: HttpClient) {
  }

  getByTaskId(taskId: number): Observable<TaskExerciseModel> {
    const url = this.urlServer + 'taskExercise/get';
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('taskId', String(taskId));
    return this.http.post<TaskExerciseModel>(url, params);
  }
}
