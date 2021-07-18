import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class BookmarksService {

  private bookMarkSubject: Subject<boolean> = new ReplaySubject<boolean>(1);
  bookmarkModel$: Observable<boolean> = this.bookMarkSubject.asObservable();

  setUpModel(loadTask: boolean) {
    this.bookMarkSubject.next(loadTask);
  }

  getModel(): Observable<boolean> {
    return this.bookmarkModel$;
  }
}
