import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageModel } from '../models/message.model';
import { BookmarksModel } from '../models/bookmarks.model';
import { DiscussionModel } from '../models/discussionModel';
import {CustomEncoder} from '../custom-encoder';
import { InfoModels } from '../models/info.models';


@Injectable({providedIn: 'root'})
export class MessageService {
  private url = `${environment.urlJedu}/rest/messenger/`;
  urlJedu = `${environment.urlJedu}/`;
  constructor(private http: HttpClient) {}



  getNotifications(userId: string): Observable<{ total: number }> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    const url = this.urlJedu + `notification/has `;
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<{ total: number }>(url, params);
  }

  getMessages(id: string): Observable<MessageModel[]> {
    const url = this.urlJedu + `notification/get`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    // params = params.append('action', 'messages');
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<MessageModel[]>(url, params);
  }

  // getBookmarks(): Observable<{ bookmarks: BookmarksModel[] }> {
  //   let params = new HttpParams({encoder: new CustomEncoder()});
  //   params = params.append('sessionId', localStorage.getItem('sessionId'));
  //   const url = `${environment.url}/rest/bookmark/read`;
  //   return this.http.post<{ bookmarks: BookmarksModel[] }>(url, params);
  // }

  addToFavorite(name: string, taskId: string, list: boolean) {
    const url = `${environment.urlJedu}/rest/bookmark/create`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('name', name);
    params = params.append('taskId', taskId);
    params = list ?  params.append('filterId', '1') : params;
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post(url, params);
  }

  deleteBook(bookmarkId: string) {
    const url = `${environment.urlJedu}/rest/bookmark/delete`;
    let params = new HttpParams();
    // params = params.append('action', 'delete');
    params = params.append('bookmarkId', bookmarkId);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post(url, params);
  }

  deleteMessage(id?: string) {
    const url = this.urlJedu + `notification/delete `;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = id ? params.append('msgId', id) : params;
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post(url, params);
  }

  getDiscussions(id: number): Observable<DiscussionModel[]> {
    const url = this.urlJedu + `comment/get`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('taskId', String(id));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<DiscussionModel[]>(url, params);
  }

  addDiscussion(shortName: number, text: string) {
    const url = this.urlJedu + `comment/save`;
    let params = new HttpParams();
    params = params.append('taskId', String(shortName));
    params = params.append('text', text);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post(url, params);
  }


  getNotificationState(): Observable<{ notification: boolean }> {
    const url = this.urlJedu + `notification/check `;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<{ notification: boolean }>(url, params);
  }

  updateNotificationState(state: boolean) {
    const url = this.urlJedu + `notification/save `;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('notification', Boolean(state).toString());
    return this.http.post(url, params);
  }

  getAdminMessage(): Observable<InfoModels> {
    const url = this.urlJedu + `info/getCurrent`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<InfoModels>(url, params);
  }
}
