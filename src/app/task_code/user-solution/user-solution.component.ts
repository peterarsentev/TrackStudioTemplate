import { Component, OnDestroy, OnInit } from '@angular/core';
import { pluck, takeUntil } from 'rxjs/operators';
import { TaskCodeService } from '../../shared/services/task-code.service';
import { NavService } from '../../shared/services/nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SolutionTaskCodeModels } from '../../shared/models/solution.task.code.models';
import { NavNode } from '../../shared/models/nav.node';

@Component({
  selector: 'app-user-solution',
  templateUrl: './user-solution.component.html',
  styleUrls: ['./user-solution.component.scss']
})
export class UserSolutionComponent implements OnInit, OnDestroy {
  options = {
    lineNumbers: true,
    readOnly: false,
    mode: 'text/x-java',
  };

  private unsubscribe$ = new Subject();
  sol: SolutionTaskCodeModels;
  constructor(
    private taskCodeService: TaskCodeService,
    private navService: NavService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: SolutionTaskCodeModels) => {
      window.scrollTo(0, 0);
      this.sol = res;
      this.setRouts();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private setRouts() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        const taskCodeId = res.task_code_id;
        const userId = res.userId;
        const topicId = res.topicId;
        this.navService.setUpModel(
          {...new NavNode(), topicId: +topicId, taskCodeId: +taskCodeId, taskId: +taskCodeId,
            solutionId: res.solutionId, name: this.sol.user.name, userId, task_code: true});
      });

  }
}
