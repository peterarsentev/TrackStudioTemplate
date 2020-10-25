import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';
import { of, Subject } from 'rxjs';
import { UserModels } from '../../../shared/models/user.models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  form: FormGroup;
  showNotification: boolean

  constructor(private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getNotificationState();
    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(user => {
        this.user = user;
  });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goToEditProfile() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  goToChangePassword() {
    this.router.navigate(['password'], { relativeTo: this.route });
  }

  getNotificationState() {
    this.messageService.getNotificationState()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.showNotification = res.notification);
  }

  sendNotification() {
    this.showNotification = !this.showNotification;
    this.messageService.updateNotificationState(this.showNotification)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => console.log(res))
  }

}
