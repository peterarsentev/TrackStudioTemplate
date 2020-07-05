import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SolvedAllCountModels } from '../../../../shared/models/solved.all.count.models';

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
  constructor(private taskService: TasksService) { }

  ngOnInit() {
  }

  private getSolvedAndAllProgress(topicId: string) {
    this.taskService.getSolvedAndAllProgress(topicId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.solvedAndAll = res;
        this.barValue = Math.round((res.solved / res.all) * 100);
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
