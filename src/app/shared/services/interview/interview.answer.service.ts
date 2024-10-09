import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomEncoder} from '../../custom-encoder';
import {InterviewTopicModels} from '../../models/interview/interview.topic.model';
import {InterviewAnswerModels} from '../../models/interview/interview.answer.model';
import {InterviewTopicQuestionModels} from '../../models/interview/interview.topic.question.model';
import {SizeModels} from '../../models/size.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewAnswerService {

  private url = `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  saveAnswer(questionId: number, text: string) {
    const url = this.url + `interviewAnswer/save`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('text', text);
    params = params.append('questionId', String(questionId));
    return this.http.post<InterviewAnswerModels>(url, params);
  }

  loadStories(questionId: number): Observable<InterviewAnswerModels[]> {
    const url = this.url + `interviewAnswer/getAnswersHistoryByUserOrderByDescCreatedAt`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('questionId', String(questionId));
    return this.http.post<InterviewAnswerModels[]>(url, params);
  }

  getTotalAnswerByQuestionId(questionId: number): Observable<SizeModels> {
    const url = this.url + `interviewAnswer/getTotalAnswerByQuestionId`;
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('questionId', String(questionId));
    return this.http.post<SizeModels>(url, params);
  }
}
