import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageModel } from '../models/message.model';
import { BookmarksModel } from '../models/bookmarks.model';
import { DiscussionMessageModel } from '../models/discussionMessageModel';
import {CustomEncoder} from '../custom-encoder';
import { InfoModels } from '../models/info.models';
import { DiscussModel } from '../models/discuss.model';


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

  getBookmarks(): Observable< BookmarksModel[]> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    const url = this.urlJedu + 'bookmark/read';
    return this.http.post<BookmarksModel[]>(url, params);
  }

  addToFavorite(model: BookmarksModel) {
    const url = this.urlJedu + 'bookmark/create';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('name', model.name);
    params = params.append('link', model.link);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post(url, params);
  }

  deleteBook(bookmarkId: string) {
    const url = this.urlJedu + 'bookmark/delete';
    let params = new HttpParams();
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

  // getDiscussions(taskId: number, exerciseId: number): Observable<DiscussionMessageModel[]> {
  getDiscussions(taskId: number, exerciseId: number, sqlExerciseId?: number): Observable<DiscussionMessageModel[]> {
    const url = this.urlJedu + `comment/get`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = taskId ? params.append('taskId', String(taskId)) : params;
    params = exerciseId ? params.append('exerciseId', String(exerciseId)) : params;
    params = sqlExerciseId ? params.append('sqlExerciseId', String(sqlExerciseId)) : params;
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<DiscussionMessageModel[]>(url, params);
  }

  // addDiscussion(taskId: number, text: string, exerciseId: number, discusId?: number): Observable<DiscussionMessageModel> {
  addDiscussion(taskId: number, text: string, exerciseId: number, discusId?: number, sqlExerciseId?: number)
    : Observable<DiscussionMessageModel> {
    const url = this.urlJedu + `comment/save`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = taskId ? params.append('taskId', String(taskId)) : params;
    params = discusId ? params.append('discussId', String(discusId)) : params;
    params = exerciseId ? params.append('exerciseId', String(exerciseId)) : params;
    params = sqlExerciseId ? params.append('sqlExerciseId', String(sqlExerciseId)) : params;
    params = params.append('text', text);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<DiscussionMessageModel>(url, params);
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

  getDiscuss(id: number): Observable<DiscussionMessageModel[]> {
    const url = this.urlJedu + `comment/discuss`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('discussId', String(id));
    return this.http.post<DiscussionMessageModel[]>(url, params);
  }

  create(name: any, description: any): Observable<DiscussModel> {
    const url = this.urlJedu + `comment/create`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('name', name);
    params = params.append('description', description);
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<DiscussModel>(url, params);
  }

  makeSubscribeOrRevert(id: number): Observable<{ subscribe: boolean }> {
    const url = this.urlJedu + `discuss/subscribe`;
    let params = new HttpParams();
    params = params.append('discussionId', String(id));
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<{subscribe: boolean}>(url, params);
  }

  getCountOfDiscuss(): Observable<{ count: number }> {
    const url = this.urlJedu + `discussNotify/getCount`;
    let params = new HttpParams();
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<{count: number}>(url, params);
  }
}
