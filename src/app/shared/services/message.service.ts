import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageModel } from '../models/message.model';


@Injectable({providedIn: 'root'})
export class MessageService {
  private url = `${environment.url}/rest/messenger`;
  constructor(private http: HttpClient) {}



  getNotifications(userId: string): Observable<{ total: number }> {

    let params = new HttpParams();
    params = params.append('action', 'has');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('userId', userId);
    return this.http.post<{ total: number }>(this.url, params);
  }

  getMessages(id: string): Observable<{ messages: MessageModel[] }> {
    let params = new HttpParams();
    params = params.append('action', 'messages');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('userId', id);
    return this.http.post<{ messages: MessageModel[] }>(this.url, params);
  }
}
