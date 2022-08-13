import { Component, OnDestroy, OnInit } from '@angular/core';
import { SolutionsModel } from '../../shared/models/solutions.model';
import { Subject } from 'rxjs';
import { NavService } from '../../shared/services/nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, takeUntil } from 'rxjs/operators';
import { NavNode } from '../../shared/models/nav.node';
import { TaskCodeService } from '../../shared/services/task-code.service';

@Component({
  selector: 'app-task-code-solutions-list',
  templateUrl: './task-code-solutions-list.component.html',
  styleUrls: ['./task-code-solutions-list.component.scss']
})
export class TaskCodeSolutionsListComponent implements OnInit, OnDestroy {
  paginationAllowed = true;
  scrollDistance = 1;
  throttle: 500;
  hasNext: boolean;
  page = 0;
  solutions: SolutionsModel[] = [];
  private unsubscribe$ = new Subject();
  private taskId: string;
  private topicId: string;

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
      ).subscribe((res: SolutionsModel[]) => {
      window.scrollTo(0, 0);
      this.solutions = res;
      this.hasNext = res.length === 20;
      this.paginationAllowed = res.length === 20;
    });
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.taskId = res.task_code_id;
        this.topicId = res.topicId;
        this.navService.setUpModel(
          {...new NavNode(), topicId: +this.topicId, taskId: +this.taskId, solutionId: res.solutionId, task_code: true});
      });
  }

  onScrollDown() {
    this.page++;
    if (this.hasNext) {
      this.getList();
    }
  }

  getList() {
    this.taskCodeService.getSolutionsByTaskId(this.page, +this.taskId)
      .subscribe(res => {
        this.solutions = this.solutions.concat(res);
        this.hasNext = res.length === 20;
        this.paginationAllowed = res.length === 20;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goTo(solution: SolutionsModel) {
    console.log(solution);
    this.router.navigate([
      'topics', `${this.topicId}`,
      'task_code', `${this.taskId}`,
      solution.solutionId, 'solutions', solution.studentId]);
  }
}
