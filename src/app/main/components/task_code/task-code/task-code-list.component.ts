import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskCodeService } from '../../../../shared/services/task-code.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TaskCodeModel } from '../../../../shared/models/task.code.models';

@Component({
  selector: 'app-task-code',
  templateUrl: './task-code-list.component.html',
  styleUrls: ['./task-code-list.component.scss']
})
export class TaskCodeListComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  taskCodeList: TaskCodeModel[] = [];

  constructor(private taskCodeService: TaskCodeService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap(res => this.taskCodeService.getTasksWithStatus(res.topicId))
      )
      .subscribe(
        res => {
          this.taskCodeList = res;
          this.taskCodeList.forEach(task => task.status === null || task.status === undefined ? task.status = 1 : task);
        }
      )
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goToTasks(topicId: string, taskId: string, status: number, solutionId: number) {
    if (status === 1) {
      this.router.navigate(['task_code'], {queryParams: {
          topicId,
          taskCodeId: taskId,
          solutionId: 'new_task'
        }});
    } else {
      this.router.navigate(['task_code'], {queryParams: {
          topicId,
          taskCodeId: taskId,
          solutionId
        }})
    }
  }
}
