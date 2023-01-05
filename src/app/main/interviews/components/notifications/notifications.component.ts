import { Component, OnDestroy, OnInit } from '@angular/core';
import { InterviewNotificationService } from '../../../../shared/services/interview.notification.service';
import { InterviewNotificationModel } from '../../../../shared/models/interview.notification.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  messages: InterviewNotificationModel[];
  unsubscribe$: Subject<void> = new Subject();

  constructor(private interviewNotificationService: InterviewNotificationService) { }

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
}
