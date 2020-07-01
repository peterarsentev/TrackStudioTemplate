import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskCodeService } from '../../../../shared/services/task-code.service';
import { takeUntil } from 'rxjs/operators';
import { TaskCodeModel } from '../../../../shared/models/task.code.models';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-task-code-view',
  templateUrl: './task-code-view.component.html',
  styleUrls: ['./task-code-view.component.scss']
})
export class TaskCodeViewComponent implements OnInit, OnDestroy {
  taskId: string;
  taskModel: TaskCodeModel = {};
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private taskCodeService: TaskCodeService) { }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.taskCodeService.getNewTask(this.taskId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.taskModel = res.rate;
        console.log(this.taskModel)
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  start() {
    this.taskCodeService.startTask(this.taskModel.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        window.scrollTo(0, 0)
        this.router.navigate(['task_code', `${res.taskCodeId}`, 'status', `${res.statusId}`, 'solution',`${res.id}`]);
      });
  }
}
