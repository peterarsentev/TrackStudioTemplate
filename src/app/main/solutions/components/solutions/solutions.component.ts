import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SolutionsModel } from '../../../../shared/models/solutions.model';
import { NavService } from '../../../../shared/services/nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, pluck, takeUntil } from 'rxjs/operators';
import { SolutionsService } from '../../solutions.service';
import { NavNode } from '../../../../shared/models/nav.node';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.scss']
})
export class SolutionsComponent implements OnInit, OnDestroy {

  paginationAllowed = true;
  scrollDistance = 1;
  throttle: 500;
  hasNext: boolean;
  page = 0;
  solutions: SolutionsModel[] = [];
  private unsubscribe$ = new Subject();
  private taskId: string;
  private topicId: string;

  constructor(private solutionService: SolutionsService,
              private navService: NavService,
              private router: Router,
              private route: ActivatedRoute) { }

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
        this.taskId = res.id;
        this.topicId = res.topicId;
        this.navService.setUpModel({...new NavNode(), topicId: +this.topicId, taskId: +this.taskId, exercise: true});
      });
  }

  onScrollDown() {
    this.page++;
    if (this.hasNext) {
      this.getList();
    }
  }

  getList() {
    this.solutionService.getSolutionsByTaskId(this.page, +this.taskId)
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
    this.router.navigate(['exercise', this.topicId, 'task-view',  this.taskId, 'solutions',  solution.solutionId]);
  }
}
