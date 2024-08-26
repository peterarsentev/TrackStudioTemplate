import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { TaskCodeService } from '../../shared/services/task-code.service';
import { SolutionTaskCodeModels } from '../../shared/models/solution.task.code.models';
import { AlertService } from '../../shared/services/alertService';
import { TypeAlertsModel } from '../../shared/models/type.alerts.model';
import { SolutionModels } from '../../shared/models/solution.models';
import { NavService } from '../../shared/services/nav.service';
import { NavNode } from '../../shared/models/nav.node';
import { UserService } from '../../shared/services/user.service';
import { UserModels } from '../../shared/models/user.models';
import { MessageService } from '../../shared/services/message.service';
import { DiscussionMessageModel } from '../../shared/models/discussionMessageModel';
import { DiscussionBlockComponent } from '../../shared/components/discussion-block/discussion-block.component';

@Component({
  selector: 'app-task-code-solution',
  templateUrl: './task-code-solution.component.html',
  styleUrls: ['./task-code-solution.component.scss']
})
export class TaskCodeSolutionComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  taskId: string;
  solutionId: string;
  status: number;
  solutionAndTaskCode: SolutionTaskCodeModels = {
    solution: {}, taskcode: {}
  };
  discussions: DiscussionMessageModel[] = [];
  output: string = undefined;
  disabled: boolean;
  private topicId: string;
  user: UserModels;
  countSolvedTasks: number;
  @ViewChild(DiscussionBlockComponent, {static: false}) discussComponent: DiscussionBlockComponent;
  showButtonBottom = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private navService: NavService,
              private taskCodeService: TaskCodeService,
              private userService: UserService,
              private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getParamsAndSolution();
    this.alertService.setUpMessage(undefined, undefined);
    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.user = res);
    this.getAllSolved();

    this.router.events
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        if (res instanceof NavigationEnd) {
          this.getAllSolved();
        }
      });
  }

  private getParamsAndSolution() {
    this.route.params
      .pipe(
        switchMap(params => {
          this.taskId = params.task_code_id;
          this.topicId = params.topicId;
          this.solutionId = params.solutionId;
          this.navService.setUpModel(
            {... new NavNode(), task_code: true, topicId: +this.topicId, taskId: +this.taskId, solutionId: this.solutionId });
          if (this.solutionId === 'new_task') {
            return this.taskCodeService.getNewTask(this.taskId)
              .pipe(
                map(res => {
                  res.status = 1;
                  return {
                    ...new SolutionTaskCodeModels(),
                    taskcode: res,
                    solution: {... new SolutionModels(), code: res.classCode, statusId: 1 }
                  };
                })
              );
          }
          return this.taskCodeService.getTaskAndSolution(this.taskId, this.solutionId);
        }),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe((res: SolutionTaskCodeModels) => {
      if (!!this.solutionId && !res.solution) {
        this.router.navigate(['/topics', this.topicId, 'task_code', res.taskcode.id, 'new_task']);
      } else if (!!this.solutionId && this.solutionId === 'new_task' && !!res.taskcode.solutionId) {
        this.router.navigate(['/topics', this.topicId, 'task_code', res.taskcode.id, res.taskcode.solutionId]);
      } else {
        this.solutionAndTaskCode = res;
        this.getDiscussions();
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  submitTask(code: string) {
    this.disabled = true;
    const solution = this.solutionAndTaskCode.solution;
    solution.code = code;
    if (this.solutionId === 'new_task') {
      let solutionId;
      this.taskCodeService.startTask(this.solutionAndTaskCode.taskcode.id)
        .pipe(
          switchMap(res => {
            solutionId = res.id;
            return this.taskCodeService.submitSolution({...res, code});
          }),
          map(result => {
            this.router.navigate(
              [
                'topics', `${this.topicId}`,
                'task_code', `${this.taskId}`,
                `${solutionId}`
              ]
            );
            return result;
          }),
          takeUntil(this.ngUnsubscribe$),
          catchError(err => {
              err.status === 401 ?
                this.alertService.setUpMessage('Вам необходимо авторизоваться в системе.', TypeAlertsModel.DANGER) :
                this.alertService.setUpMessage('Сервис не доступен, попробуйте позже еще раз', TypeAlertsModel.DANGER);
              return throwError(err);
            }
          )
        )
        .subscribe(res => {
          this.prepareResult(res);
          this.disabled = false;
        });
    } else {
      this.taskCodeService.submitSolution(solution)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => {
          this.prepareResult(res);
          this.disabled = false;
        });
    }
  }

  private prepareResult(res: { output: string, status: number }) {
    this.solutionAndTaskCode.solution.statusId = res.status;
    this.output = res.output;
    if (res.status === 3) {
      this.alertService.setUpMessage('Задача решена не верно, попробуйте еще раз', TypeAlertsModel.DANGER);
    }
    if (res.status === 4) {
      this.alertService.setUpMessage('Поздравляем! Задача решена верно!', TypeAlertsModel.SUCCESS);
      this.getAllSolved();
    }
  }

  resetSolution(reset: boolean) {
    if (reset) {
      this.taskCodeService.reset(this.solutionId)
        .subscribe(res => this.router.navigate([
          'topics', `${this.topicId}`,
          'task_code', `${this.taskId}`,
          'new_task'
        ]));
    }
  }

  closeDiscussion(text: string) {
    if (!!text) {
      this.submitComment(text);
    }
  }

  submitComment(text: string) {
    this.messageService.addDiscussion(undefined, text, +this.taskId)
      .subscribe(res => {
        this.getDiscussions();
      }, error => {
        if (error.status === 403) {
          alert('У вас нет прав на эту операцию!');
        }
      });
  }

  private getDiscussions() {
    this.messageService.getDiscussions(undefined, +this.taskId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.discussions = res);
  }

  private getAllSolved() {
    this.taskCodeService.countSolutions(this.taskId)
      .subscribe(res => this.countSolvedTasks = res.count);
  }

  goToSolutions() {
    this.router.navigate([
      'topics', `${this.topicId}`,
      'task_code', `${this.taskId}`,
      this.solutionId, 'solutions'
    ]);
  }

  addResponse(data: DiscussionMessageModel) {
    this.messageService.addDiscussion(undefined, data.text, +this.taskId, data.discussId, undefined,  data.parentId)
      .subscribe(res => {
        this.getDiscussions();
      }, error => {
        if (error.status === 403) {
          alert('У вас нет прав на эту операцию!');
        }
      });
  }

  updateDiscussion(discussion: DiscussionMessageModel) {
    console.log(discussion);
    this.messageService.updateDiscussion(discussion)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.getDiscussions());
  }

  deleteDiscussion(d: any) {
    this.messageService.deleteDiscussion(d.id)
      .pipe(switchMap(() =>     this.messageService.getDiscussions(undefined, +this.taskId)),
        takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.discussions = res);
  }

  showDiscussionForm() {
    this.discussComponent.showDiscussionForm();
  }

  showButton() {
    this.showButtonBottom = true;
  }
}
