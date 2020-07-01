import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskCodeService } from '../../../../shared/services/task-code.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
    this.getTaskCodeByTopicId(this.route.snapshot.paramMap.get('id'))
  }

  getTaskCodeByTopicId(id: string) {
    this.taskCodeService.getTasksWithStatus(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.taskCodeList = res;
        this.taskCodeList.forEach(task => task.status === null || task.status === undefined ? task.status = 1 : task);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goToTasks(taskId: string, status: number, solutionId: number) {
    console.log(solutionId)
    if (status === 1) {
      this.router.navigate(['task_view', `${taskId}`]);
    } else {
      this.router.navigate(['task_code', `${taskId}`, 'status', `${status}`, 'solution',`${solutionId}`])
    }
  }
}
