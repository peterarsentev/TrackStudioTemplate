import { Component, OnDestroy, OnInit } from '@angular/core';
import { pluck, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../../shared/services/user.service';
import { Subject } from 'rxjs';
import { UserModels } from '../../../../shared/models/user.models';
import { ActivatedRoute } from '@angular/router';
import { InterviewModel } from '../../../../shared/models/interview.model';
import { InterviewsService } from '../../interviews.service';
import { WisherModel } from '../../../../shared/models/wisher.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  showAlert = false;
  existingId: number;
  form: FormGroup;
  author = false;
  wisher: WisherModel;
  constructor(private userService: UserService,
              private interviewsService: InterviewsService,
              private route: ActivatedRoute,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: InterviewModel) => {
      this.interview = res;
      if (this.interview.status === 'AWAITING') {
        this.buildForm();
      }
      if (!!this.user) {
        this.requestWasSend = !!this.interview.wishers.find(w => w.userId === +this.user.id);
        this.hasApproved = !!this.interview.wishers.find(w => w.approve);
        this.wisher = this.interview.wishers.find(w => w.approve);
      }
      });
    this.userService
      .getModel()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user;
        this.requestWasSend = !!this.interview.wishers.find(w => w.userId === +user.id);
        this.hasApproved = !!this.interview.wishers.find(w => w.approve);
        this.wisher = this.interview.wishers.find(w => w.approve);
        this.author = this.interview.submitterId === +this.user.id;
      });
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.showAlert = false);

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  joinToInterview() {
    this.interviewsService.check()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        if (!res.canCreate) {
          this.showAlert = true;
          this.existingId = res.id;
        } else {
          this.showInput = true;
        }
      });
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
      .subscribe(interview => {
        this.interview = interview;
        this.requestWasSend = !!this.interview.wishers.find(w => w.userId === +this.user.id);
        this.hasApproved = !!this.interview.wishers.find(w => w.approve);
        this.wisher = this.interview.wishers.find(w => w.approve);
        if (this.interview.status === 'AWAITING') {
          this.buildForm();
        }
      });
  }

  sendApprove(wisher: WisherModel) {
    this.interviewsService.approveWisher(wisher.id, this.interview.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getById();
        this.hasApproved = true;
      });
  }

  setDescription(text: string) {
    if (!!text) {
      this.form.get('comment').setValue(text);
    }
  }

  sendReview() {
    if (this.form.valid) {
      this.interviewsService.sendReview(this.interview.id, this.form.get('score').value, this.form.get('comment').value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => this.getById());
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      score: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }
}
