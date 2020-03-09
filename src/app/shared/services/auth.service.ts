import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginModel } from '../models/login.model';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthResponse, UserResponse } from '../models/interfaces';

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  login(user: LoginModel = {action: 'login', login: 'anonymous', password: '123'}): Observable<AuthResponse> {
    let param = new HttpParams();
    param = param.append('action', user.action);
    param = param.append('login', user.login);
    param = param.append('password', user.password);
    return this.http.post(`${environment.url}/rest/auth`, param)
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
    param = param.append('action', 'session');
    param = param.append('sessionId', sessionId);
    return this.http.post<UserResponse>(`${environment.url}/rest/auth`, param)
      .pipe(
        tap(response => this.setdefaultProjectId(response.user.defaultProjectId)),
        catchError(err => {
            localStorage.clear();
            console.error('err', err);
            return this.login()
              .pipe(
                switchMap(res  => this.getDefaultProjectId())
              );
          }
        )
      );
  }

  private setdefaultProjectId(defaultProjectId: string | null) {
    if (defaultProjectId) {
      localStorage.setItem('defaultProjectId', defaultProjectId);
    } else {
      localStorage.clear()
    }
  }

}
