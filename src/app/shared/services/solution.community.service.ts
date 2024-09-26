import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomEncoder} from '../custom-encoder';
import {TaskExerciseModel} from '../models/task.exercise.model';
import {SolutionCommunityModel} from '../models/solution.community.model';
import {DiscussModel} from '../models/discuss.model';
import {SolutionCommunityOperationModel} from '../models/solution.community.operation.model';

@Injectable({
  providedIn: 'root'
})
export class SolutionCommunityService {

  private urlServer =  `${environment.url}/`;
  constructor(private http: HttpClient) {
  }

  publishSolution(solutionCodeId: number, operationId: number): Observable<SolutionCommunityModel> {
    const url = this.urlServer + 'solutionCommunity/publish';
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    if (solutionCodeId !== undefined) {
      params = params.append('solutionCodeId', String(solutionCodeId));
    }
    if (operationId !== undefined) {
      params = params.append('operationId', String(operationId));
    }
    return this.http.post<SolutionCommunityModel>(url, params);
  }

  findAll(page: number): Observable<SolutionCommunityModel[]> {
    const url = this.urlServer + 'solutionCommunity/all';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('page', String(page));
    return this.http.post<SolutionCommunityModel[]>(url, params);
  }


  findById(solutionCommunityId: number): Observable<SolutionCommunityModel> {
    const url = this.urlServer + 'solutionCommunity/get';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('solutionCommunityId', String(solutionCommunityId));
    return this.http.post<SolutionCommunityModel>(url, params);
  }

  findOperationsBySolutionCommunityId(solutionCommunityId: number): Observable<SolutionCommunityOperationModel[]> {
    const url = this.urlServer + 'solutionCommunity/operations';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('solutionCommunityId', String(solutionCommunityId));
    return this.http.post<SolutionCommunityOperationModel[]>(url, params);
  }

  saveOperation(solutionCommunityId: number, text: string): Observable<SolutionCommunityOperationModel> {
    const url = this.urlServer + 'solutionCommunity/saveOperation';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('solutionCommunityId', String(solutionCommunityId));
    params = params.append('text', text);
    return this.http.post<SolutionCommunityOperationModel>(url, params);
  }
}
