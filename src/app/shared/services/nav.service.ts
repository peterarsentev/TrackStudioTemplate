import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NavNode } from '../models/nav.node';

@Injectable({providedIn: 'root'})
export class NavService {
  private navSubject: Subject<NavNode> = new ReplaySubject<NavNode>(1);
  navModel$: Observable<NavNode> = this.navSubject.asObservable();

  setUpModel(navs: NavNode) {
    this.navSubject.next(navs);
  }

  getModel(): Observable<NavNode> {
    return this.navModel$;
  }
}
