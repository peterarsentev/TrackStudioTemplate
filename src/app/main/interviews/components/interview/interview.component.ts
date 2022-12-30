import { Component, OnDestroy, OnInit } from '@angular/core';
import { pluck, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../../shared/services/user.service';
import { Subject } from 'rxjs';
import { UserModels } from '../../../../shared/models/user.models';
import { ActivatedRoute } from '@angular/router';
import { InterviewModel } from '../../../../shared/models/interview.model';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit, OnDestroy {

  unsubscribe$: Subject<void> = new Subject();
  user: UserModels;
  private interview: InterviewModel;
  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: InterviewModel) => {
      this.interview = res;
      });
    this.userService
      .getModel()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user;
      });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
