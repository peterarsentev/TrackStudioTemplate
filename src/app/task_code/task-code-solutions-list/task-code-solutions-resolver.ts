import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SolutionsModel } from '../../shared/models/solutions.model';
import { TaskCodeService } from '../../shared/services/task-code.service';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TaskCodeSolutionsResolver implements Resolve<SolutionsModel[]> {
  constructor(private taskCodeService: TaskCodeService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<SolutionsModel[]> | Promise<SolutionsModel[]> | SolutionsModel[] {
    const taskId = route.params.task_code_id;
    return this.taskCodeService.getSolutionsByTaskId(0, taskId);
  }

}
