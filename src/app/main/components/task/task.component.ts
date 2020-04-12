import {Component, OnDestroy, OnInit, Pipe, PipeTransform} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Subject } from 'rxjs';

declare var hljs: any;

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {

  task: TaskModel = {};
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.getTask()
  }

  private getTask() {
    this.route.queryParams.pipe(
      switchMap(res => this.tasksService.getTask(res.taskId, res.action))
    ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.task = res.task;
        // hljs.initHighlighting();
        setTimeout(() => hljs.initHighlighting(),0);
      });
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goToComments() {
    this.router.navigate(['comments'], {
      queryParams: {
        taskId: this.task.id
      }
    });
  }
}
