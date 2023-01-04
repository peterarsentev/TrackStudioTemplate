import { Component, OnDestroy, OnInit } from '@angular/core';
import { pluck, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../../shared/services/user.service';
import { Subject } from 'rxjs';
import { UserModels } from '../../../../shared/models/user.models';
import { ActivatedRoute } from '@angular/router';
import { InterviewModel } from '../../../../shared/models/interview.model';
import { InterviewsService } from '../../interviews.service';
import { WisherModel } from '../../../../shared/models/wisher.model';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit, OnDestroy {

  unsubscribe$: Subject<void> = new Subject();
  user: UserModels;
  interview: InterviewModel;
  showInput: boolean;
  contact: string;
  requestWasSend: boolean;
  hasApproved: boolean;
  constructor(private userService: UserService,
              private interviewsService: InterviewsService,
              private route: ActivatedRoute) { }

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
        this.requestWasSend = !!this.interview.wishers.find(w => w.userId === +user.id);
        this.hasApproved = !!this.interview.wishers.find(w => w.approve);
        console.log(this.hasApproved);
      });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  joinToInterview() {
    this.showInput = true;
  }

  sendRequest() {
    this.showInput = false;
    this.interviewsService.addNewWisher(this.contact, this.interview.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.requestWasSend = true;
        this.getById();
      });
  }

  getById() {
    this.interviewsService.getById(this.interview.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(interview => this.interview = interview);
  }

  sendApprove(wisher: WisherModel) {
    this.interviewsService.approveWisher(wisher.id, this.interview.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getById();
        this.hasApproved = true;
      });
  }
}
