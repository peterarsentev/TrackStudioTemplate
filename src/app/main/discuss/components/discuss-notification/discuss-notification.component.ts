import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationListModel } from '../../../../shared/models/notification.list.model';
import { DiscussService } from '../../discuss.service';

@Component({
  selector: 'app-discuss-notification',
  templateUrl: './discuss-notification.component.html',
  styleUrls: ['./discuss-notification.component.scss']
})
export class DiscussNotificationComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  notifications: NotificationListModel[];
  constructor(private discussService: DiscussService,  public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: NotificationListModel[]) => this.notifications = res);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  delete(not: NotificationListModel, idx: number) {
      this.discussService.deleteNotification(not.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => this.notifications.splice(idx, 1));
  }
}
