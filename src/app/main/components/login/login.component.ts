import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from '../../../shared/models/login.model';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';
import { UserModels } from '../../../shared/models/user.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  validationErrors = {
    login: [{ type: 'required', message: 'Введите логин' }],
    password: [{ type: 'required', message: 'Введите пароль' }],
  };
  form: FormGroup;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  error: boolean;
  submit: boolean;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  login() {
    this.submit = true;
    const loginModel = new LoginModel();
    loginModel.action = 'login';
    loginModel.login = this.form.get('login').value;
    loginModel.password = this.form.get('password').value;
    this.authService
      .login(loginModel)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (res) => {
          this.form.reset();
          this.submit = false;
          this.route.navigate(['/exercise']);
        },
        () => {
          this.error = true;
          this.submit = false;
        }
      );
  }

  private initForm() {
    this.form = this.fb.group({
      login: [{ value: '', disabled: this.submit }, Validators.required],
      password: [{ value: '', disabled: this.submit }, Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  resetError() {
    this.error = false;
  }

  goMain() {
    this.submit = true;
    this.authService
      .login()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.submit = false;
        this.route.navigate(['/'], {});
      });
  }

  registration() {
    this.route.navigate(['registration']);
  }
}

