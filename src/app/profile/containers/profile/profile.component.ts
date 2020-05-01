import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';
import { Subject } from 'rxjs';
import { UserModels } from '../../../shared/models/user.models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  form: FormGroup;

  constructor(private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
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
}
