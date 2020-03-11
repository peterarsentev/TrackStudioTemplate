import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { TaskModel } from '../../../shared/models/task.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  tasks: TaskModel[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap(res => this.tasksService.getNavRout(res.taskId))
      ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.tasks = res.tasks)
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goToNav(nav: TaskModel) {
    const action  = nav.categoryId === '1' ? 'tasks' : 'task';
    const taskId = nav.id;

    this.router.navigate([action], {
      queryParams: {
        action,
        taskId
      }
    })
  }
}
