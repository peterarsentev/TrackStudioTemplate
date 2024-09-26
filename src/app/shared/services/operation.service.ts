import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomEncoder} from '../custom-encoder';
import {TaskExerciseModel} from '../models/task.exercise.model';
import {SolutionCommunityModel} from '../models/solution.community.model';
import {DiscussModel} from '../models/discuss.model';
import {SolutionCommunityOperationModel} from '../models/solution.community.operation.model';
import {OperationCommunityModel} from '../models/operation.community.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  private urlServer =  `${environment.url}/`;
  constructor(private http: HttpClient) {
  }

  findById(operationId: number): Observable<OperationCommunityModel> {
    const url = this.urlServer + 'operation/get';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('operationId', String(operationId));
    return this.http.post<OperationCommunityModel>(url, params);
  }

}
