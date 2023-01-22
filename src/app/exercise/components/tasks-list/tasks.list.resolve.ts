import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import { Observable } from 'rxjs';
import { TasksService } from '../../../shared/services/tasks.service';

@Injectable({providedIn: 'root'})
export class TasksListResolve implements Resolve<TaskTopicModel[]> {
  constructor(private taskService: TasksService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskTopicModel[]>
    | Promise<TaskTopicModel[]> | TaskTopicModel[] {
    const id = route.params.topicId;
    if (route.url.join('/').indexOf('search') !== -1) {
      return this.taskService.getTasksBySearch(route.params.search);
    }
    return this.taskService.getTasksByTopicId(id);
  }

}

