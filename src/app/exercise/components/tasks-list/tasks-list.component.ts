import { Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, takeUntil } from 'rxjs/operators';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import { Subject } from 'rxjs';
import { NavService } from '../../../shared/services/nav.service';
import { NavNode } from '../../../shared/models/nav.node';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {

  topicId;
  tasks: TaskTopicModel[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private tasksService: TasksService,
              private router: Router,
              private navService: NavService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.topicId = res.topicId;
        this.navService.setUpModel({...new NavNode(), topicId: this.topicId, exercise: true});
      });
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => this.tasks = res);
  }

  showTask(taskTopic: TaskTopicModel) {
    if (taskTopic.solution) {
      this.router.navigate(['exercise', `${this.topicId}`, 'task-view', `${taskTopic.task.id}`, 'solutionId', `${taskTopic.solution.id}`]);
    } else {
      this.router.navigate(['exercise', `${this.topicId}`, 'task-view', `${taskTopic.task.id}`]);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  getSolutionId(task: TaskTopicModel) {
    if (!task.solution) {return ''}
    return '[#' + task.solution.id + ']';
  }
}
