import { Component, OnDestroy, OnInit } from '@angular/core';
import { InterviewNotificationService } from '../../../../shared/services/interview.notification.service';
import { InterviewNotificationModel } from '../../../../shared/models/interview.notification.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  messages: InterviewNotificationModel[];
  unsubscribe$: Subject<void> = new Subject();

  constructor(private interviewNotificationService: InterviewNotificationService, public router: Router) { }

  ngOnInit() {
    this.getAll();
    this.markAsRead();
  }

  private getAll() {
    this.interviewNotificationService.getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.messages = res;
      });
  }

  private markAsRead() {
    this.interviewNotificationService.markAsRead()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {});
  }

  deleteMessage() {
    this.interviewNotificationService.deleteAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.messages = []);

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  delete(message: InterviewNotificationModel) {
    this.interviewNotificationService.delete(message.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.getAll());
  }

  goTo(message: InterviewNotificationModel) {
    this.router.navigate(['interviews', 'view',  message.interviewId]);
  }
}
