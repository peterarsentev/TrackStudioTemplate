import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { TaskModel } from '../../../shared/models/task.model';
import { TasksService } from '../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { ResponseModel } from '../../../shared/models/response.model';
import { MStatusesModel } from '../../../shared/models/m.statuses.model';
import { MessageService } from '../../../shared/services/message.service';
import { BookmarksService } from '../../../shared/services/bookmarks.service';

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

  constructor(private route: ActivatedRoute,
              private tasksService: TasksService,
              private messageService: MessageService,
              private bookmarksService: BookmarksService,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap(res => {
          this.taskId = res.taskId;
          this.geButtons(res.taskId);
          return this.tasksService.getTaskByProjectId(res.taskId)
        })
      ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
      this.tasks = res.tasks;
      this.disable = false;
      // console.log('tasks', res)
    })
  }

  openTask(task: TaskModel) {
    console.log(task)
    const url = task.childrenCount > 0 ? 'tasks': 'task';
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
    console.log('clic', this.disable)
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

}
