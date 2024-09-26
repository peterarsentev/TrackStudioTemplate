import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CustomEncoder } from '../../app/shared/custom-encoder';
import { AssistantModel } from './assistant.model';

@Injectable({providedIn: 'root'})
export class AssistantService {
  urlJedu = `${environment.url}/`;

  constructor(private http: HttpClient) {
  }

  private navSubject: Subject<string> = new ReplaySubject<string>(1);
  assistant: Observable<string> = this.navSubject.asObservable();

  setUpModel(text: string) {
    this.navSubject.next(text);
  }

  getModel(): Observable<string> {
    return this.assistant;
  }

  getAnswer(question: string): Observable<AssistantModel> {
    let params = new HttpParams({encoder: new CustomEncoder()});
    params = params.append('sessionId', localStorage.getItem('sessionId'));
    params = params.append('question', question);
    return this.http.post<AssistantModel>(this.urlJedu + 'assistant/explain', params);
  }
}
