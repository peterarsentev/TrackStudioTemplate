import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CommentService {
  private userModelSubject: Subject<Boolean> = new ReplaySubject<Boolean>(1);
  productModel$: Observable<Boolean> = this.userModelSubject.asObservable();

  setUpModel(loadTask: boolean) {
    this.userModelSubject.next(loadTask);
  }

  getModel(): Observable<Boolean> {
    return this.productModel$;
  }
}
