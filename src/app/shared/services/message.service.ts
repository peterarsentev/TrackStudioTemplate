import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageModel } from '../models/message.model';
import { BookmarksModel } from '../models/bookmarks.model';


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

  getBookmarks(): Observable<{ bookmarks: BookmarksModel[] }> {
    let params = new HttpParams();
    params = params.append('action', 'read');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = `${environment.url}/rest/bookmark`;
    return this.http.post<{ bookmarks: BookmarksModel[] }>(url, params);
  }

  addToFavorite(name: string, taskId: string, list: boolean) {
    const url = `${environment.url}/rest/bookmark`;
    let params = new HttpParams();
    params = params.append('action', 'create');
    params = params.append('name', name);
    params = params.append('taskId', taskId);
    params = list ?  params.append('filterId', '1') : params;
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post(url, params);
  }

  deleteBook(bookmarkId: string) {
    const url = `${environment.url}/rest/bookmark`;
    let params = new HttpParams();
    params = params.append('action', 'delete');
    params = params.append('bookmarkId', bookmarkId);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post(url, params);
  }

  /*
  curl http://localhost:8080/TrackStudio/rest/bookmark
  -d action=delete
  -d sessionId=7f0e1f47b83ce6381db1e4b4855bb53a
  -d bookmarkId=4028b88171fcf2cb0171fcf883ca0004
   */
}
