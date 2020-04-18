import {Component, OnDestroy, OnInit, Pipe, PipeTransform} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Subject } from 'rxjs';
import { ButtonCommentModel } from '../../../shared/models/button.comment.model';

declare var hljs: any;

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {

  task: TaskModel = {};
  taskId: string;
  buttons: ButtonCommentModel[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.getTask()
   this.getMessages(this.taskId);
   this.getButtons(this.taskId);
  }

  private getTask() {
    this.route.queryParams.pipe(
      switchMap(res => {
        this.taskId = res.taskId;
        return this.tasksService.getTask(res.taskId, res.action);
      })
    ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.task = res.task;
        setTimeout(() => {
            document.querySelectorAll('pre code').forEach((block) => {
              hljs.highlightBlock(block);
            });
          }, 0);
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

  private getMessages(taskId: string) {
    this.tasksService.getMessages(taskId)
      .subscribe(res => console.log(res))
  }

  private getButtons(taskId: string) {
    this.tasksService.getButtonsForTask(taskId)
      .subscribe((buttons) => {
        this.buttons = buttons.mstatuses
        console.log(this.buttons)
      });
  }
}
