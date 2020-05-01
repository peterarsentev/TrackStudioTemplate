import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';
import { Subject } from 'rxjs';
import { UserModels } from '../../../shared/models/user.models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  form: FormGroup;

  constructor(private userService: UserService,
              private authService: AuthService,
              private fb: FormBuilder,
  private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm()
    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(user => {
        this.user = user;
        if (!!this.user) {
          this.populateForm();
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      email: [''],
      name: ['']
    })
  }

  private populateForm() {
    this.form.get('email').setValue(this.user.email);
    this.form.get('name').setValue(this.user.name);
  }

  submitForm() {
    const email = this.form.get('email').value;
    const name = this.form.get('name').value;
    this.authService.updateProfile(this.user.id, email, name)
      .pipe(
        switchMap(() =>  this.authService.getDefaultProjectId()),
        takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.router.navigate(['/profile'], { relativeTo: this.route });
      });
  }
}
