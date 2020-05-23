import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageModel } from '../models/message.model';
import { BookmarksModel } from '../models/bookmarks.model';
import { DiscussionModel } from '../models/discussionModel';


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

  deleteMessage(id?: string) {
    const url = `${environment.url}/rest/messenger`;
    let params = new HttpParams();
    params = params.append('action', 'delete');
    params = id ? params.append('msgId', id) : params;
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post(url, params);
  }

  getDiscussions(shortName: string): Observable<DiscussionModel[]> {
    const url = `https://job4j.ru/jedu/comment`;
    let params = new HttpParams();
    params = params.append('action', 'get');
    params = params.append('task', shortName);
    return this.http.post<DiscussionModel[]>(url, params);
  }

  addDiscussion(shortName: string, text: string) {
    const url = `https://job4j.ru/jedu/comment`;
    let params = new HttpParams();
    params = params.append('action', 'save');
    params = params.append('task', shortName);
    params = params.append('text', text);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post(url, params);
  }
}
