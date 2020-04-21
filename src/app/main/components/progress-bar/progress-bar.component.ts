import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {

  @Input() task: TaskModel = {};
  allTasksCount  = 1;
  solvedTasksCount: number;
  barValue = 0;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.getAllTasks();
    this.getSolvedTasks();
  }

  getAllTasks() {
    this.tasksService.getTaskCount(this.task.id, true)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.allTasksCount = res.total;
      })
  }

  getSolvedTasks() {
    this.tasksService.getTaskCount(this.task.id, false)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.solvedTasksCount = res.total;
        this.barValue = Math.round((this.solvedTasksCount / this.allTasksCount) * 100)
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
