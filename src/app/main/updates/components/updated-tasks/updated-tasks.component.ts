import { Component, OnInit } from '@angular/core';
import { TaskTopicModel } from '../../../../shared/models/task.topic.model';
import { TasksService } from '../../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { NavNode } from '../../../../shared/models/nav.node';
import { NavService } from '../../../../shared/services/nav.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updated-tasks',
  templateUrl: './updated-tasks.component.html',
  styleUrls: ['./updated-tasks.component.scss']
})
export class UpdatedTasksComponent implements OnInit {

  tasks: TaskTopicModel[] = [];
  page = 0;
  paginationAllowed = true;
  scrollDistance = 2;
  throttle = 300;
  unsubscribe$: Subject<void> = new Subject();
  private hasNext: boolean;
  constructor(private taskService: TasksService, private navService: NavService, private router: Router) { }

  ngOnInit() {
    this.navService.setUpModel({...new NavNode(), updates: true });
    this.taskService.getTasksByUpdate(this.page)
      .subscribe(res => {
        this.tasks = res.content;
        this.hasNext = res.hasNext;
      });
  }
  onScrollDown() {
    if (this.hasNext) {
      this.page++;
      this.taskService.getTasksByUpdate(this.page)
        .subscribe(res => {
          this.tasks = this.tasks.concat(res.content);
          this.hasNext = res.hasNext;
          this.paginationAllowed = res.hasNext;
        });
    }
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

  goToMain() {
    this.router.navigate(['/']);
  }

  goTo(task: TaskTopicModel) {
    this.router.navigate(['/exercise', task.task.topicId]);
  }
}
