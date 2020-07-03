import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TaskCodeService } from '../../../../shared/services/task-code.service';
import { SolutionTaskCodeModels } from '../../../../shared/models/solution.task.code.models';

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
          this.status = params.status;
          return this.taskCodeService.getSolution(this.taskId, this.solutionId)
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
    this.taskCodeService.submitSolution(solution)
      .subscribe(res => this.output = res.output)
  }
}
