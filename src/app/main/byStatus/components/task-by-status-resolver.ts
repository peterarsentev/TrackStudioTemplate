import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TaskByStatusResolver implements Resolve<TaskTopicModel[]> {
  constructor(private tasksService: TasksService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<TaskTopicModel[]> | Promise<TaskTopicModel[]> | TaskTopicModel[] {
    const status = route.params.status;
    return this.tasksService.getTasksByStatus(0, status);
  }


}
