import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DiscussService } from '../../discuss.service';
import { NotificationListModel } from '../../../../shared/models/notification.list.model';

@Injectable({providedIn: 'root'})
export class DiscussNotificationResolve  implements Resolve<NotificationListModel[]> {
  constructor(private discussService: DiscussService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<NotificationListModel[]> | Promise<NotificationListModel[]> | NotificationListModel[] {
    return this.discussService.getNotifications();
  }

}
