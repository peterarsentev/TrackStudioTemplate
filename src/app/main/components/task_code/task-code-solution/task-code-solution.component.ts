import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { TaskCodeService } from '../../../../shared/services/task-code.service';
import { SolutionTaskCodeModels } from '../../../../shared/models/solution.task.code.models';
import { AlertService } from '../../../../shared/services/alertService';
import { TypeAlertsModel } from '../../../../shared/models/type.alerts.model';
import { SolutionModels } from '../../../../shared/models/solution.models';

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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private taskCodeService: TaskCodeService
  ) { }

  ngOnInit() {
    this.getParamsAndSolution();
  }

  private getParamsAndSolution() {
    this.route.params
      .pipe(
        switchMap(params => {
          this.taskId = params.taskId;
          this.solutionId = params.solutionId;
          if (this.solutionId === 'new_task') {
            return this.taskCodeService.getNewTask(this.taskId)
              .pipe(
                map(res => {
                  res.rate.status = 1;
                  return {
                    ...new SolutionTaskCodeModels(),
                    taskcode: res.rate,
                    solution: {... new SolutionModels(), code: res.rate.classCode, statusId: 1 }
                  }
                })
              )
          }
          return this.taskCodeService.getSolution(this.taskId, this.solutionId);
        })
      ).subscribe(res => {
      this.solutionAndTaskCode = res;
      console.log(this.solutionAndTaskCode)
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  submitTask(code: string) {
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
            this.router.navigate(['task_code', `${this.taskId}`, 'solution',`${solutionId}`])
            return result;
          }),
          takeUntil(this.ngUnsubscribe$)
        )
        .subscribe(res => this.prepareResult(res))
    } else {
      this.taskCodeService.submitSolution(solution)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => this.prepareResult(res));
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
