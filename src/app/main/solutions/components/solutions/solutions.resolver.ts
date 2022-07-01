import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SolutionsModel } from '../../../../shared/models/solutions.model';
import { Observable } from 'rxjs';
import { SolutionsService } from '../../solutions.service';

@Injectable({providedIn: 'root'})
export class SolutionsResolver implements Resolve<SolutionsModel[]> {
  constructor(private solutionService: SolutionsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<SolutionsModel[]> | Promise<SolutionsModel[]> | SolutionsModel[] {
    const taskId = route.params.taskId;
    return this.solutionService.getSolutionsByTaskId(0, taskId);
  }
}
