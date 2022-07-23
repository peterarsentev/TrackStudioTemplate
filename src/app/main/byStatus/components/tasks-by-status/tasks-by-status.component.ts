import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskTopicModel } from '../../../../shared/models/task.topic.model';
import { TasksService } from '../../../../shared/services/tasks.service';
import { NavService } from '../../../../shared/services/nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavNode } from '../../../../shared/models/nav.node';

@Component({
  selector: 'app-tasks-by-status',
  templateUrl: './tasks-by-status.component.html',
  styleUrls: ['./tasks-by-status.component.scss']
})
export class TasksByStatusComponent implements OnInit, OnDestroy {

  paginationAllowed = true;
  scrollDistance = 1;
  throttle: 500;
  hasNext: boolean;
  page = 0;
  tasks: TaskTopicModel[] = [];
  private unsubscribe$ = new Subject();
  private status: string;

  constructor(private tasksService: TasksService,
              private navService: NavService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.status = res.status;
        this.navService.setUpModel({...new NavNode(), solutions: true, status: this.status });
      });
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: TaskTopicModel[]) => {
      window.scrollTo(0, 0);
      this.tasks = res;
      this.hasNext = res.length === 20;
      this.paginationAllowed = res.length === 20;
    });
  }

  onScrollDown() {
    this.page++;
    if (this.hasNext) {
      this.getList();
    }
  }

  getList() {
    this.tasksService.getTasksByStatus(this.page, this.status)
      .subscribe(res => {
        this.tasks = this.tasks.concat(res);
        this.hasNext = res.length === 20;
        this.paginationAllowed = res.length === 20;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getSolutionId(task: TaskTopicModel) {
    if (!!task.task) {
      let res = ' [#' + task.task.taskNumber;
      if (task.solution) {
        res += ' #' + task.solution.id;
      }
      res += ']';
      return res;
    }
    return '';
  }
}
