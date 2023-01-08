import { InterviewsService } from '../../interviews.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { InterviewModel } from '../../../../shared/models/interview.model';
import { Observable } from 'rxjs';
import { NavService } from '../../../../shared/services/nav.service';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class InterviewResolver implements Resolve<InterviewModel> {
  constructor(private interviewsService: InterviewsService, private navService: NavService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<InterviewModel> | Promise<InterviewModel> | InterviewModel {
    const id = route.params.id;
    return this.interviewsService.getById(id)
      .pipe(tap(res => {
        this.navService.setUpModel({name: res.title, url: '/interviews/view/' + res.id, interview: true});
        return res;
      }));
  }
}
