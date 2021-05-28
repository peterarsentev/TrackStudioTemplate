import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TaskModel } from '../../../shared/models/task.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';

@Injectable({providedIn: 'root'})
export class TopicResolver implements Resolve<TaskModel[]> {
  constructor(private taskService: TasksService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskModel[]>
    | Promise<TaskModel[]>
    | TaskModel[] {
    return this.taskService.getTasksTopicsList();
  }

}
