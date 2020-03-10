import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  task: TaskModel = {};
  constructor(private route: ActivatedRoute, private tasksService: TasksService) { }

  ngOnInit() {
    this.getTask()
  }

  private getTask() {
    this.route.queryParams.pipe(
      switchMap(res => this.tasksService.getTask(res.taskId, res.action))
    ).subscribe(res => this.task = res.task)
  }
}
