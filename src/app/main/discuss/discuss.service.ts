import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustomEncoder } from '../../shared/custom-encoder';
import { Observable } from 'rxjs';
import { DiscussModel } from '../../shared/models/discuss.model';
import { DiscussSearch } from '../../shared/models/discuss.search';
import { NotificationListModel } from '../../shared/models/notification.list.model';
import { DiscussionMessageModel } from '../../shared/models/discussionMessageModel';

@Injectable({
  providedIn: 'root'
})
export class DiscussService {
  urlJedu = `${environment.url}/`;

  constructor(private http: HttpClient) { }

  findAll(page: number, my?: boolean): Observable<DiscussModel[]> {
    const url = this.urlJedu + 'discuss/findAll';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = my ? params.append('my', String(my)) : params;
    params = params.append('page', String(page));
    return this.http.post<DiscussModel[]>(url, params);
  }

  getById(id: number): Observable<DiscussModel> {
    const url = this.urlJedu + 'discuss/findById';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post<DiscussModel>(url, params);
  }

  search(search: string): Observable<DiscussSearch> {
    const url = this.urlJedu + 'discuss/search';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('search', search);
    return this.http.post<DiscussSearch>(url, params);
  }

  getNotifications(): Observable<NotificationListModel[]> {
    const url = this.urlJedu + 'discussNotify/getMyNotifications';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<NotificationListModel[]>(url, params);
  }

  deleteNotification(id: number) {
    const url = this.urlJedu + 'discussNotify/delete';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post(url, params);
  }


  deleteNotificationByUser(id: number) {
    const url = this.urlJedu + 'discussNotify/deleteByUser';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('id', String(id));
    return this.http.post(url, params);
  }

  getCommentsByUserId(userId: number): Observable<DiscussionMessageModel[]> {
    const url = this.urlJedu + 'comment/getComments';
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('userId', String(userId));
    return this.http.post< DiscussionMessageModel[]>(url, params);
  }
}
