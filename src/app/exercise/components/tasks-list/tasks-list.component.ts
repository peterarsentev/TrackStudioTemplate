import { Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, takeUntil } from 'rxjs/operators';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import { Subject } from 'rxjs';
import { NavService } from '../../../shared/services/nav.service';
import { NavNode } from '../../../shared/models/nav.node';
import { TopicModels } from '../../../shared/models/topic.models';
import { log } from 'util';
import { PreviousNextNavModels } from '../../../shared/models/previous.next.nav.models';
import { NextNavModels } from '../../../shared/models/next.nav.models';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {

  name: string;
  topicId;
  tasks: TaskTopicModel[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  topic: TopicModels;
  task: NextNavModels = {};

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
        this.getTopic();
        this.getNextOrPrevious(this.topicId);
      });
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe((res: TaskTopicModel[]) => {
        this.tasks = res;
        window.scrollTo(0, 0);
    });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  getSolutionId(task: TaskTopicModel) {
    if (!!task.task) {
      let res = ' [#' + task.task.number;
      if (task.solution) {
        res += ' #' + task.solution.id;
      }
      res += ']';
      return res;
    }
    return '';
  }

  private getTopic() {
    if (this.topicId) {
      this.tasksService.getTopicById(this.topicId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => {
          this.topic = res;
          this.name = this.topic.name;
        });
    }
  }

  goBackToList(topicId?: number) {
    if (!topicId || topicId === -1) {
      this.router.navigate(['exercise']).then(() => window.scrollTo(0, 0));
    } else {
      this.router.navigate(['exercise', `${topicId}`]).then(() => window.scrollTo(0, 0));
    }
  }

  private getNextOrPrevious(topicId: number) {
    this.tasksService.getNextAndPreviousTopic(topicId)
      .subscribe((res: NextNavModels) => {
        this.task = res;
      });
  }
}
