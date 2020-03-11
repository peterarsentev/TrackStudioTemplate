import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from '../../../shared/models/login.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {


  validationErrors = {
    login: [
      { type: 'required', message: 'Введите логин'}
    ],
    password: [
      { type: 'required', message: 'Введите пароль'}
    ]
  };
  form: FormGroup;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder,
              private route: Router,
              public authService: AuthService) { }

  ngOnInit() {
    this.initForm();
  }

  closeModal() {
    this.route.navigate(['/']);
  }

  login() {
    const loginModel = new LoginModel();
    loginModel.action = 'login';
    loginModel.login = this.form.get('login').value;
    loginModel.password = this.form.get('password').value;
    this.authService.login(loginModel)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        console.log('res', res)
        this.form.reset();
        this.route.navigate(['/']);
      },
        error => console.log('err', error));
      }

  private initForm() {
    this.form = this.fb.group({
      login:['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}