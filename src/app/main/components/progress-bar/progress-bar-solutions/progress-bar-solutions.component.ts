import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SolvedAllCountModels } from '../../../../shared/models/solved.all.count.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progress-bar-solutions',
  templateUrl: './progress-bar-solutions.component.html',
  styleUrls: ['./progress-bar-solutions.component.scss']
})
export class ProgressBarSolutionsComponent implements OnInit, OnDestroy {

  solvedAndAll: SolvedAllCountModels = {};
  barValue: number = 0;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  @Input()set topicId(topicId: string) {
    this.getSolvedAndAllProgress(topicId);
  }

  constructor(private taskService: TasksService, private router: Router) { }

  ngOnInit() {}

  private getSolvedAndAllProgress(id: string) {
    if (this.router.url.includes('topics')) {
      this.taskService.getSolvedAndAllProgress(id)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => this.setResult(res));
    }
    if (this.router.url.includes('exercise')) {
      this.taskService.getSolvedAndAllProgressTasks(id)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => this.setResult(res));
    }
  }

  setResult(res: SolvedAllCountModels) {
    this.solvedAndAll = res;
    this.barValue = Math.round((res.solved / res.all) * 100);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
