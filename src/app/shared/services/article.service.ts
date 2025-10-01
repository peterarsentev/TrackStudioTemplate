import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomEncoder } from '../custom-encoder';
import { Observable } from 'rxjs';
import {ArticleModel} from "../models/article.model";

@Injectable({providedIn: 'root'})
export class ArticleService {

  private url = `${environment.url}/`;

  constructor(private http: HttpClient) {}

  getAllArticles(): Observable<ArticleModel[]> {
    console.log('make call');
    const url = this.url + 'article/list';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<ArticleModel[]>(url, params);
  }

  getById(id: number): Observable<ArticleModel> {
    const url = this.url + 'article/findById';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('articleId', String(id));
    return this.http.post<ArticleModel>(url, params);
  }
}
