import { Injectable } from '@angular/core';
import { DBConstat } from '../components/constants/dbconstat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';
import { Aopt } from '../models/aopt.model';
import { environment } from '../../../environments/environment';
import {CategoryModels} from '../models/category.models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url =  `${environment.urlJedu}/`;

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<CategoryModels[]> {
    const url = this.url + 'category/all';
    let params = new HttpParams();
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<CategoryModels[]>(url, params);
  }
}
