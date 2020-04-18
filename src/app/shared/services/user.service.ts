import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { UserModels } from '../models/user.models';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private productModelSubject: Subject<UserModels> = new ReplaySubject<UserModels>(1);
  productModel$: Observable<UserModels> = this.productModelSubject.asObservable();

  setUpModel(prod: UserModels) {
    this.productModelSubject.next(prod);
  }


  getModel(): Observable<UserModels> {
    return this.productModel$;
  }
}
