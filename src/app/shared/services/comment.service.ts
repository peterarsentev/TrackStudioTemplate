import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CommentService {
  private userModelSubject: Subject<boolean> = new ReplaySubject<boolean>(1);
  userModel$: Observable<boolean> = this.userModelSubject.asObservable();

  setUpModel(loadTask: boolean) {
    this.userModelSubject.next(loadTask);
  }

  getModel(): Observable<boolean> {
    return this.userModel$;
  }
}
