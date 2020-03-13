import { Component, Input, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  @Input()  task: TaskModel = {};
  allTasksCount  = 1;
  solvedTasksCount: number;
  barValue = 0;

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.getAllTasks();
    this.getSolvedTasks();
  }

  getAllTasks() {
    this.tasksService.getTaskCount(this.task.id, true)
      .subscribe(res => {
        this.allTasksCount = res.total;
      })
  }

  getSolvedTasks() {
    this.tasksService.getTaskCount(this.task.id, false)
      .subscribe(res => {
        this.solvedTasksCount = res.total;
        this.barValue = Math.round(this.solvedTasksCount / this.allTasksCount) * 100;
      })
  }
}
