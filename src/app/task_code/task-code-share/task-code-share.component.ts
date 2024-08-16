import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TaskCodeModel } from '../../shared/models/task.code.models';
import { NextPreviousSolutions } from '../../shared/models/nextPreviousSolutions';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { AlertService } from '../../shared/services/alertService';
import {TaskCodeService} from '../../shared/services/task-code.service';
import {SolutionTaskCodeModels} from '../../shared/models/solution.task.code.models';
import {UserService} from '../../shared/services/user.service';
import {UserModels} from '../../shared/models/user.models';
import {NavNode} from '../../shared/models/nav.node';
import {NavService} from '../../shared/services/nav.service';

@Component({
  selector: 'app-task-code-share',
  templateUrl: './task-code-share.component.html',
  styleUrls: ['./task-code-share.component.scss']
})
export class TaskCodeShareComponent implements OnInit {
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  options = {
    lineNumbers: true,
    readOnly: true,
    mode: 'text/x-java',
  };
  taskCodeModel: SolutionTaskCodeModels;
  taskId: string;
  solutionId: string;
  userModels: UserModels;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private navService: NavService,
              private alertService: AlertService,
              private taskService: TasksService,
              private userService: UserService,
              private taskCodeService: TaskCodeService) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
          this.navService.setUpModel({...new NavNode(), topicId: params.topicId, task_code_share: true});
          return this.taskCodeService.getSolution(params.task_code_id, params.solutionId);
        }), takeUntil(this.ngUnsubscribe$)
      ).subscribe((res: SolutionTaskCodeModels) => {
        this.taskCodeModel = res;
        this.userService.getById(res.solution.userId)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((rs: any) => {
            this.userModels = rs.user;
          });
    });
  }
}

