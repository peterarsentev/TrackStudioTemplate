import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { TaskCodeService } from '../../shared/services/task-code.service';
import { SolutionTaskCodeModels } from '../../shared/models/solution.task.code.models';
import { AlertService } from '../../shared/services/alertService';
import { TypeAlertsModel } from '../../shared/models/type.alerts.model';
import { SolutionModels } from '../../shared/models/solution.models';
import { NavService } from '../../shared/services/nav.service';
import { NavNode } from '../../shared/models/nav.node';

@Component({
  selector: 'app-task-code-solution',
  templateUrl: './task-code-solution.component.html',
  styleUrls: ['./task-code-solution.component.scss']
})
export class TaskCodeSolutionComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  taskId: string;
  solutionId: string;
  status: string;
  solutionAndTaskCode: SolutionTaskCodeModels = {
    solution: {}, taskcode: {}
  };
  output: string = undefined;
  disabled: boolean;
  private topicId: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private navService: NavService,
              private taskCodeService: TaskCodeService
  ) { }

  ngOnInit() {
    this.getParamsAndSolution();
    this.alertService.setUpMessage(undefined, undefined);
  }

  private getParamsAndSolution() {
    this.route.params
      .pipe(
        switchMap(params => {
          this.taskId = params.task_code_id;
          this.topicId = params.topicId;
          this.solutionId = params.solutionId;
          this.navService.setUpModel({... new NavNode(), task_code: true, topicId: +this.topicId, taskId: +this.taskId,solutionId: this.solutionId })
          if (this.solutionId === 'new_task') {
            return this.taskCodeService.getNewTask(this.taskId)
              .pipe(
                map(res => {
                  res.status = 1;
                  return {
                    ...new SolutionTaskCodeModels(),
                    taskcode: res,
                    solution: {... new SolutionModels(), code: res.classCode, statusId: 1 }
                  }
                })
              )
          }
          return this.taskCodeService.getSolution(this.taskId, this.solutionId);
        }),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => {
      this.solutionAndTaskCode = res;
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
            return this.taskCodeService.submitSolution({...res, code})
          }),
          map(result => {
            this.router.navigate(
              [
                'topics', `${this.topicId}`,
                'task_code', `${this.taskId}`,
                'solution', `${solutionId}`
              ]
            );
            return result;
          }),
          takeUntil(this.ngUnsubscribe$),
          catchError(err => {
              err.status === 401 ?
                this.alertService.setUpMessage("Вам необходимо авторизоваться в системе.", TypeAlertsModel.DANGER) :
                this.alertService.setUpMessage("Сервис не доступен, попробуйте позже еще раз", TypeAlertsModel.DANGER);
              return throwError(err)
            }
          )
        )
        .subscribe(res => {
          this.prepareResult(res);
          this.disabled = false;
        })
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
    this.output = res.output
    if (res.status === 3) {
      this.alertService.setUpMessage("Задача решена не верно, попробуйте еще раз", TypeAlertsModel.DANGER);
    }
    if (res.status == 4) {
      this.alertService.setUpMessage("Поздравляем! Задача решена верно!", TypeAlertsModel.SUCCESS);
    }
  }
}
