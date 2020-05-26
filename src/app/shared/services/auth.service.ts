import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginModel } from '../models/login.model';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthResponse, UserResponse } from '../models/interfaces';
import { UserService } from './user.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();
  public api_Host = '';

  constructor(private http: HttpClient, private userService: UserService) {
    this.initApiHost();
  }

  get apiHost() {
    return this.api_Host;
  }

  login(user: LoginModel = {login: 'anonymous', password: '123'}): Observable<AuthResponse> {
    let param = new HttpParams();
    param = param.append('login', user.login);
    param = param.append('password', user.password);
    return this.http.post(`${environment.url}/rest/auth/login`, param)
      .pipe(
        tap(this.setSessionId),
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse) {
    localStorage.clear();
    this.error$.next(error.error.error);
    return throwError(error);
  }

  private setSessionId(response: AuthResponse | null) {
    if (response.sessionId) {
      localStorage.setItem('sessionId', response.sessionId);
    } else {
      localStorage.clear();
    }
  }

  /**
   * method returns current user by sessionId
   * @param sessionId
   */
  getDefaultProjectId(): Observable<UserResponse> {
    const sessionId = localStorage.getItem('sessionId');
    let param = new HttpParams();
    //param = param.append('action', 'session');
    param = param.append('sessionId', sessionId);
    if (!!sessionId) {
      return this.http.post<UserResponse>(`${environment.url}/rest/auth/session`, param)
        .pipe(
          catchError(err => {
              localStorage.clear();
              console.error('err', err);
              return this.login()
                .pipe(
                  switchMap(res => this.getDefaultProjectId())
                );
            }
          ),
          tap(response => this.setdefaultProjectId(response.user.defaultProjectId)),
          tap(response => this.userService.setUpModel(response.user)),
        );
    } else {
      return this.login()
        .pipe(
          switchMap(() => this.getDefaultProjectId()),
          tap(response => this.setdefaultProjectId(response.user.defaultProjectId)),
          tap(response => this.userService.setUpModel(response.user)),
        )
    }
  }

  private setdefaultProjectId(defaultProjectId: string | '1') {
    if (defaultProjectId) {
      localStorage.setItem('defaultProjectId', defaultProjectId);
    } else {
      localStorage.setItem('defaultProjectId', '1');
    }
  }

  logOut() {
    const url = `${environment.url}/rest/auth/logout`;
    const sessionId = localStorage.getItem('sessionId');
    let param = new HttpParams();
    //param = param.append('action', 'logout');
    param = param.append('sessionId', sessionId);
    localStorage.clear();
    return this.http.post(url, param)
  }

  private initApiHost() {
    this.api_Host = environment.url;
  }

  changePassword(userId: string, password: string, confirm: string) {
    const url = `${environment.url}/rest/user/password`;
    let param = new HttpParams();
    const sessionId = localStorage.getItem('sessionId');
    //param = param.append('action', 'password');
    param = param.append('sessionId', sessionId);
    param = param.append('password', password);
    param = param.append('confirm', confirm);
    param = param.append('userId', userId);
    return this.http.post(url, param);
  }

  updateProfile(userId: string, email: string, name: string) {
    const url = `${environment.url}/rest/user/update`;
    const sessionId = localStorage.getItem('sessionId');
    let param = new HttpParams();
    //param = param.append('action', 'update');
    param = param.append('sessionId', sessionId);
    param = param.append('userId', userId);
    param = param.append('email', email);
    param = param.append('name', name);
    return this.http.post(url, param);
  }
}
