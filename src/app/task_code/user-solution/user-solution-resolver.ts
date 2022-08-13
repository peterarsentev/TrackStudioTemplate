import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SolutionTaskCodeModels } from '../../shared/models/solution.task.code.models';
import { Observable } from 'rxjs';
import { TaskCodeService } from '../../shared/services/task-code.service';

@Injectable({providedIn: 'root'})
export class UserSolutionResolver implements Resolve<SolutionTaskCodeModels> {
  constructor(private taskCodeService: TaskCodeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<SolutionTaskCodeModels> | Promise<SolutionTaskCodeModels> | SolutionTaskCodeModels {
    const taskCodeId = route.params.task_code_id;
    const userId = route.params.userId;
    return this.taskCodeService.getSolutionByUserId(taskCodeId, userId);
  }
}
