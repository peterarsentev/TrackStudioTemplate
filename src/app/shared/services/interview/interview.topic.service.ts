import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomEncoder} from '../../custom-encoder';
import {InterviewTopicModels} from '../../models/interview/interview.topic.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewTopicService {

  private url = `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  getAllInterviewTopics(): Observable<InterviewTopicModels[]> {
    const url = this.url + `interviewTopic/all`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    return this.http.post<InterviewTopicModels[]>(url, params);
  }

  getById(topicId: number): Observable<InterviewTopicModels> {
    const url = this.url + `interviewTopic/get`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', String(topicId));
    return this.http.post<InterviewTopicModels>(url, params);
  }
}
