import { Injectable } from '@angular/core';
import {DBConstat} from "../components/constants/dbconstat";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Answer} from "../models/answer.model";
import {Userforexam} from "../models/userforexam.model";

@Injectable({
  providedIn: 'root'
})
export class UserforexamService {

  private url = DBConstat.dbURL;

  constructor(private http: HttpClient) {
  }

  getByLogin(login): Observable<Userforexam> {
    const url = this.url + 'userlist/getByLogin';
    let params = new HttpParams();
    params = params.append('login', login);
    return this.http.post<Userforexam>(url, params);
  }

  getById(id): Observable<Userforexam> {
    const url = this.url + 'userlist/getById';
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post<Userforexam>(url, params);
  }

  get(): Observable<Userforexam[]> {
    const url = this.url + 'userlist/get';
    let params = new HttpParams();
    return this.http.post<Userforexam[]>(url, params);
  }

  saveOrUpdateQuestion(answer: Userforexam): Observable<Userforexam> {
    const url = answer.id == 0 ? this.url + 'userlist/add' : this.url + 'userlist/update';
    let params = new HttpParams();
    params = params.append('id', String(answer.id));
    params = params.append('login', String(answer.login));
    return this.http.post<Userforexam>(url, params);
  }
}
