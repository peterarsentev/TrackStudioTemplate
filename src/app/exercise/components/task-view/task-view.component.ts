import { Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserEduModels } from '../../../shared/models/userEduModels';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  topicId;
  taskId;
  showCommentForm: boolean;
  task: TaskTopicModel = {};
  handlers: UserEduModels[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  constructor(private taskService: TasksService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.topicId = this.route.snapshot.params.topicId
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res =>  {
      this.getTaskById(res.id);
      this.taskId = res.id;
    })
    this.getHandlersList();
  }

  getTaskById(id: string) {
    this.taskService.getTaskById(id)
      .subscribe(res => this.task = res);
  }

  goBackToList() {
    this.router.navigate(['exercise', `${this.topicId}`])
  }

  goToComments(number: number) {
    setTimeout(() => {
      const el = document.querySelector('.end')
      el.scrollIntoView({behavior: 'smooth', block: 'end'});
    }, 1)
  }

  getHandlersList() {
    return this.taskService.getHandlers()
      .pipe( takeUntil(this.ngUnsubscribe$))
      .subscribe(handlers => {
        this.handlers = handlers;
      })
  }
}

