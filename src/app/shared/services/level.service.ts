import { Injectable } from '@angular/core';
import { DBConstat } from '../components/constants/dbconstat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';
import { Aopt } from '../models/aopt.model';
import { environment } from '../../../environments/environment';
import {CategoryModels} from '../models/category.models';
import {LevelModels} from '../models/level.models';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  private url =  `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {
  }

  getLevels(): Observable<LevelModels[]> {
    const url = this.url + 'level/all';
    let params = new HttpParams();
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<LevelModels[]>(url, params);
  }
}
