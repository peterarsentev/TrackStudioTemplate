import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { UserModels } from '../models/user.models';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userModelSubject: Subject<UserModels> = new ReplaySubject<UserModels>(1);
  userModel$: Observable<UserModels> = this.userModelSubject.asObservable();

  setUpModel(user: UserModels) {
    this.userModelSubject.next(user);
  }

  getModel(): Observable<UserModels> {
    return this.userModel$;
  }
}
