import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskCodeService } from '../../shared/services/task-code.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TaskCodeModel } from '../../shared/models/task.code.models';
import { NavService } from '../../shared/services/nav.service';
import { NavNode } from '../../shared/models/nav.node';
import { TasksService } from '../../shared/services/tasks.service';


export enum Complexity {
  EAZY = 'EAZY', MEDIUM = 'MEDIUM', DIFFICULT = 'DIFFICULT'
}
@Component({
  selector: 'app-task-code',
  templateUrl: './task-code-list.component.html',
  styleUrls: ['./task-code-list.component.scss']
})
export class TaskCodeListComponent implements OnInit, OnDestroy {
  complexity = [
    {key: Complexity.EAZY, name: 'Легко'},
    {key: Complexity.MEDIUM, name: 'Средне'},
    {key: Complexity.DIFFICULT, name: 'Сложно'}
  ];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  taskCodeList: TaskCodeModel[] = [];
  name: string;
  private topicId: string;

  constructor(private taskCodeService: TaskCodeService,
              private router: Router,
              private tasksService: TasksService,
              private navService: NavService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(res => {
          this.topicId =  res.topicId;
          this.navService.setUpModel({...new NavNode(), topicId: res.topicId, task_code: true});
          return this.taskCodeService.getTasksWithStatus(res.topicId);
        })
      )
      .subscribe(
        res => {
          this.taskCodeList = res;
          this.taskCodeList.forEach(task => {
            if (!task.status) {
              task.status = 1;
            }
          });
          this.getTopic();
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goToTasks(topicId: string, taskId: string, status: number, solutionId: number) {
    const id = status === 1 ? 'new_task' : solutionId;
    this.router.navigate(['task_code', `${taskId}`, `${id}`], {relativeTo: this.route});
  }

  private getTopic() {
    this.taskCodeService.getTopicById(this.topicId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.name = res.name;
      });
  }

  onChange(value: any) {
    if (value) {
      value = value === 'Choose...' ? null : value;
      this.taskCodeService.getTasksWithStatus(this.topicId, value)
        .subscribe(res => {
          this.taskCodeList = res;
          this.taskCodeList.forEach(task => {
            if (!task.status) {
              task.status = 1;
            }
          });
          this.getTopic();
        });
    }
  }
}
