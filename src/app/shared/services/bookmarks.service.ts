import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class BookmarksService {
  private bookMarkSubject: Subject<Boolean> = new ReplaySubject<Boolean>(1);
  bookmarkModel$: Observable<Boolean> = this.bookMarkSubject.asObservable();

  setUpModel(loadTask: boolean) {
    this.bookMarkSubject.next(loadTask);
  }

  getModel(): Observable<Boolean> {
    return this.bookmarkModel$;
  }
}
