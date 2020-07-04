import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { TypeAlertsModel } from '../models/type.alerts.model';

@Injectable({providedIn: 'root'})
export class AlertService {
  constructor() {
  }

  private alertSubject: Subject<{message: string, type: TypeAlertsModel}> = new ReplaySubject<{message: string, type: TypeAlertsModel}>(1);
  alertMessage$: Observable<{ message: string, type: TypeAlertsModel }> = this.alertSubject.asObservable();

  setUpMessage(message: string, type: TypeAlertsModel) {
    this.alertSubject.next({message, type});
  }

  getModel(): Observable<{message: string, type: TypeAlertsModel }> {
    return this.alertMessage$;
  }
}
