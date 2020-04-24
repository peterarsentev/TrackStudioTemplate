import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { forkJoin, Subject } from 'rxjs';
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
    this.getCountAllAndSolvedTasks();
  }

  getCountAllAndSolvedTasks() {
    forkJoin([this.tasksService.getTaskCount(this.task.id, true, false),
      this.tasksService.getTaskCount(this.task.id, false, false)])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([all, solved]) => {
        this.allTasksCount = all.total;
        this.solvedTasksCount = solved.total;
        this.barValue = Math.round((this.solvedTasksCount / this.allTasksCount) * 100);
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
