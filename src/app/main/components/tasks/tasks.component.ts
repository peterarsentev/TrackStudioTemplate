import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { TaskModel } from '../../../shared/models/task.model';
import { TasksService } from '../../../shared/services/tasks.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {

  tasks: TaskModel[];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private tasksService: TasksService,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap(res => this.tasksService.getTaskByProjectId(res.taskId))
      ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
      this.tasks = res.tasks;
      console.log(res)
    })
  }

  openTask(task: TaskModel) {
    if (task.categoryId === '1') {
      this.router.navigate(['tasks'], {
        queryParams: {
          action: 'tasks',
          taskId: task.id
        }
      });
    } else {
      this.router.navigate(['task'], {
        queryParams: {
          action: 'task',
          taskId: task.id
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
