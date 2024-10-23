import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomEncoder} from '../../custom-encoder';
import {InterviewTopicModels} from '../../models/interview/interview.topic.model';
import {InterviewQuestionModels} from '../../models/interview/interview.question.model';
import {environment} from '../../../../environments/environment';
import {InterviewTopicQuestionModels} from '../../models/interview/interview.topic.question.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewQuestionService {

  private url = `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  findByTopicId(topicId: number): Observable<InterviewQuestionModels[]> {
    const url = this.url + `interviewQuestion/findByTopicId`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', String(topicId));
    return this.http.post<InterviewQuestionModels[]>(url, params);
  }

  getQuestionsWithStatisticByTopic(topicId: number): Observable<Map<number, number>> {
    const url = this.url + `interviewQuestion/getQuestionsWithStatisticByTopic`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', String(topicId));
    return this.http.post<Map<number, number>>(url, params);
  }

  findByTopicIdAndQuestionId(topicId: number, questionId: number): Observable<InterviewTopicQuestionModels> {
    const url = this.url + `interviewQuestion/findByTopicIdAndQuestionId`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('topicId', String(topicId));
    params = params.append('questionId', String(questionId));
    return this.http.post<InterviewTopicQuestionModels>(url, params);
  }

  getById(questionId: number): Observable<InterviewQuestionModels> {
    const url = this.url + `interviewQuestion/get`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('questionId', String(questionId));
    return this.http.post<InterviewQuestionModels>(url, params);
  }
}
