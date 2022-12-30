import { InterviewsService } from '../../interviews.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { InterviewModel } from '../../../../shared/models/interview.model';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class InterviewResolver implements Resolve<InterviewModel>{
  constructor(private interviewsService: InterviewsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<InterviewModel> | Promise<InterviewModel> | InterviewModel {
    const id = route.params.id;
    return this.interviewsService.getById(id);
  }
}
