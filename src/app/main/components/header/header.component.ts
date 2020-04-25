import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserModels } from '../../../shared/models/user.models';
import { AuthService } from '../../../shared/services/auth.service';
import { TasksService } from '../../../shared/services/tasks.service';
import { MessageService } from '../../../shared/services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  notifications = false;
  count: number;
  constructor(private userService: UserService,
              private messageService: MessageService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(user => {
        this.user = user
        this.notifications = (!!this.user.name && this.user.name !== 'Аnonymous');
        if (this.notifications) {
          this.getNotifications(this.user.id);
        }
      });
    this.authService.getDefaultProjectId()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {});

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  clearStorage() {
    this.userService.setUpModel({})
    if (this.user.name !== 'Аnonymous') {
     this.authService.logOut()
       .pipe(takeUntil(this.ngUnsubscribe$))
       .subscribe(res => {
         this.notifications = false;
       });
    }
  }

  getNotifications(id: string) {
    this.messageService.getNotifications(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.count = res.total);
  }

  readMessages() {
    this.router.navigate(['/messages']);
  }
}
