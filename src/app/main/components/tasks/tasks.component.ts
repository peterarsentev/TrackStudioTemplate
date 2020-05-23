import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TaskModel } from '../../../shared/models/task.model';
import { TasksService } from '../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { ResponseModel } from '../../../shared/models/response.model';
import { MStatusesModel } from '../../../shared/models/m.statuses.model';
import { MessageService } from '../../../shared/services/message.service';
import { BookmarksService } from '../../../shared/services/bookmarks.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {

  tasks: ResponseModel[] = [];
  mstatuses: MStatusesModel[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  private taskId: string;
  private disable = false;
  title: string;

  constructor(private route: ActivatedRoute,
              private tasksService: TasksService,
              private messageService: MessageService,
              private bookmarksService: BookmarksService,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap(res => {
          if (!!res.taskId) {
            console.log('res', res);
            this.taskId = res.taskId;
            this.geButtons(res.taskId);
            this.title = 'Задания'
            return this.tasksService.getTaskByProjectId(res.taskId);
          }
          return this.tasksService.getNavRout()
            .pipe(
              switchMap((res) => {
                this.title = 'Уровни'
                return this.tasksService.getTaskByProjectId(res.tasks[res.tasks.length - 1].id)
              })
            )
        })
      ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
      this.tasks = res.tasks;
      this.disable = false;
    })
  }

  openTask(task: TaskModel) {
    const url = task.preferences.includes('V') ? 'task' : 'tasks';
    this.router.navigate([url], {
      queryParams: {
        action: url,
        taskId: task.id,
        number: task.number
      }
    });
  }

  geButtons(taskId: string) {
    this.tasksService.getButtons(taskId)
      .subscribe(res => this.mstatuses = res.mstatuses)
  }

  goToNewTask(status: MStatusesModel) {
    this.router.navigate(['/new-task'], {
      queryParams: {
        taskId: this.taskId,
        mstatusId: status.id
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  addToFavorite() {
    if (!this.disable) {
      this.tasksService.getTask(this.taskId, 'task', '1')
        .pipe(
          switchMap( res => this.messageService.addToFavorite(res.task.string, res.task.id, true)),
          takeUntil(this.ngUnsubscribe$)
          )
        .subscribe(() => {
          this.disable = true;
          this.bookmarksService.setUpModel(true);
        })
    }
  }

  getSpentDays(submitdate: number, updatedate: number) {
   const days =(moment(updatedate).diff(moment(submitdate), 'days'));
    if (days < 1) {
      const time = ((updatedate - submitdate) / 3600000);
      if (time < 0.1) {
        return 'менее часа.';
      }
      return 'часы - ' + time + '.';
    }
   return 'дни - ' + days + '.';
  }
}
