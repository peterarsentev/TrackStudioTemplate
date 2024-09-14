// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
// import { AssistantModel } from './assistant.model';
// import { Observable, of } from 'rxjs';
// import { AssistantService } from './assistant.service';
// import { switchMap } from 'rxjs/operators';
//
// @Injectable({providedIn: 'root'})
// export class AssistantResolver implements Resolve<AssistantModel> {
//   constructor(private assistantService: AssistantService) {
//   }
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
//     Observable<AssistantModel> | Promise<AssistantModel> | AssistantModel {
//     const item = localStorage.getItem('assistant');
//     if (!item) {
//       return of(new AssistantModel('Нет выделенного текста', ''));
//     }
//     return this.assistantService.getAnswer(item);
//   }
//
// }
