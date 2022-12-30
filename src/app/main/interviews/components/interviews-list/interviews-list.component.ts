import { Component, OnDestroy, OnInit } from '@angular/core';
import { InterviewModel } from '../../../../shared/models/interview.model';
import { InterviewsService } from '../../interviews.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-interviews-list',
  templateUrl: './interviews-list.component.html',
  styleUrls: ['./interviews-list.component.scss']
})
export class InterviewsListComponent implements OnInit, OnDestroy {

  paginationAllowed = true;
  unsubscribe$: Subject<void> = new Subject();
  scrollDistance = 1;
  throttle: 500;
  hasNext: boolean;
  page = 0;
  interviews: InterviewModel[] = [ { title: 'Синтаксис ', submitterName:  'Ivan' }];
  constructor(private interviewsService: InterviewsService, private router: Router) { }

  ngOnInit() {
    this.getInterview();
  }

  onScrollDown() {

  }

  goTo(interviews: any) {
    this.router.navigate(['interviews', 'view', `${interviews.id}`]);
  }

  private getInterview() {
    this.interviewsService.getInterview()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.interviews = res);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
