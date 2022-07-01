import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Links } from '../../../../shared/models/links';
import { Observable } from 'rxjs';
import { SolutionsService } from '../../solutions.service';

@Injectable({providedIn: 'root'})
export class StudentResolver implements Resolve<Links> {
  constructor(private solutionService: SolutionsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Links> | Promise<Links> | Links {
    const taskId = route.params.taskId;
    const authorId = route.params.authorId;
    const solutionId = route.params.solutionId;
    console.log(taskId, authorId);
    return this.solutionService.getSolutionsLinks(taskId, authorId, solutionId);
  }

}
