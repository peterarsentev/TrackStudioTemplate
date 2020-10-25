import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from './must.mutch';
import { AuthService } from '../../../shared/services/auth.service';
import { Subject } from 'rxjs';
import { UserModels } from '../../../shared/models/user.models';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnDestroy {

  form: FormGroup;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  alert: boolean;

  constructor(private fb:FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(user => {
        this.user = user
      });
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      password: ['', Validators.required],
      confirm: ['', Validators.required]
    },
      {
        validators: MustMatch('password', 'confirm')
      })
  }

  submit() {
    const password = this.form.get('password').value;
    const confirm = this.form.get('confirm').value;
    this.authService.changePassword(this.user.id, btoa(password), btoa(confirm))
      .subscribe(res => {
        this.form.disable()
        this.alert = true;
        setTimeout(()=>{
          this.router.navigate(['profile'])
        }, 1500)
        console.log(res)
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
