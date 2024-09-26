import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { UserModels } from '../models/user.models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomEncoder } from '../custom-encoder';
import { TaskTopicModel } from '../models/task.topic.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  urlJedu = `${environment.url}/`;
  constructor(private http: HttpClient) {
  }

  private userModelSubject: Subject<UserModels> = new ReplaySubject<UserModels>(1);
  userModel$: Observable<UserModels> = this.userModelSubject.asObservable();

  setUpModel(user: UserModels) {
    this.userModelSubject.next(user);
  }

  getModel(): Observable<UserModels> {
    return this.userModel$;
  }

  getById(id: number): Observable<UserModels> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    const url = this.urlJedu + `user/get`;
    return this.http.post<UserModels>(url, params);
  }
}
