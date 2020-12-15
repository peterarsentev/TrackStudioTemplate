import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginModel } from '../models/login.model';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthResponse, UserResponse } from '../models/interfaces';
import { UserService } from './user.service';
import {CustomEncoder} from '../custom-encoder';
import { RegistrationModel } from '../models/registration.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();
  public api_Host = '';
  private urlJedu = `${environment.urlJedu}/`;

  constructor(private http: HttpClient, private userService: UserService) {
    this.initApiHost();
  }

  get apiHost() {
    return this.api_Host;
  }

  login(user: LoginModel = {login: 'anonymous', password: '123'}): Observable<AuthResponse> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('login', user.login);
    params = params.append('password', user.password);
    return this.http.post(`${this.urlJedu}login/login`, params)
      .pipe(
        tap(this.setSessionId),
        tap(response => this.userService.setUpModel(response.user)),
        tap(() => localStorage.setItem('defaultProjectId', '1')),
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
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    if (!!sessionId) {
      return this.http.post<UserResponse>(`${environment.urlJedu}/login/session`, params)
        // .pipe(
        //   catchError(err => {
        //       localStorage.clear();
        //       console.error('err', err);
        //       return this.login()
        //         .pipe(
        //           switchMap(res => this.getDefaultProjectId())
        //         );
        //     }
        //   ),
        //   tap(response => this.setdefaultProjectId(response.user.defaultProjectId)),
        //   tap(response => this.userService.setUpModel(response.user)),
        // );
    } else {
      // return this.login()
      //   .pipe(
      //     switchMap(() => this.getDefaultProjectId()),
      //     tap(response => this.setdefaultProjectId(response.user.defaultProjectId)),
      //     tap(response => this.userService.setUpModel(response.user)),
      //   )
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
    const url = `${this.urlJedu}login/logout`;
    const sessionId = localStorage.getItem('sessionId');
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    localStorage.clear();
    return this.http.post(url, params);
  }

  private initApiHost() {
    this.api_Host = environment.urlJedu;
  }

  changePassword(userId: string, password: string, confirm: string) {
    const url = this.urlJedu + 'user/password';
    let params = new HttpParams({encoder: new CustomEncoder()});
    const sessionId = localStorage.getItem('sessionId');
    params = params.append('sessionId', sessionId);
    params = params.append('password', password);
    params = params.append('confirm', confirm);
    params = params.append('userId', userId);
    return this.http.post(url, params);
  }

  updateProfile(userId: string, email: string, name: string) {
    const url = this.urlJedu + 'user/update';
    const sessionId = localStorage.getItem('sessionId');
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    params = params.append('id', userId);
    params = params.append('email', email);
    params = params.append('name', name);
    return this.http.post(url, params)
      .pipe(
        tap(this.setSessionId),
        tap(response => this.userService.setUpModel(response.user)),
        tap(() => localStorage.setItem('defaultProjectId', '1')),
        catchError(this.handleError.bind(this))
      );
  }

  registration(loginModel: RegistrationModel) {
    const url = `${environment.urlJedu}/rest/registration/registration`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('login', loginModel.login);
    params = params.append('username', loginModel.name);
    params = params.append('email', loginModel.email);
    params = params.append('registrationId', '0873958f731ecce301732d369cbe3c29');
    return this.http.post(url, params);
  }

  checkSession(): Observable<AuthResponse> {
    const url = this.urlJedu + 'user/session';
    const sessionId = localStorage.getItem('sessionId');
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', sessionId);
    return this.http.post(url, params);
  }
}
