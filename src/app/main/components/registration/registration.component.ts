import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserModels } from '../../../shared/models/user.models';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { LoginModel } from '../../../shared/models/login.model';
import { RegistrationModel } from '../../../shared/models/registration.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  validationErrors = {
    login: [{ type: "required", message: "Введите логин" }],
    name: [{ type: "required", message: "Введите имя" }],
    email: [{ type: "required", message: "Введите email" }],
  };
  form: FormGroup;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  error: boolean;
  submit: boolean;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
  }


  private initForm() {

    this.form = this.fb.group({
      login: [{ value: "", disabled: this.submit }, Validators.required],
      name: [{ value: "", disabled: this.submit }, Validators.required],
      email: [{ value: "", disabled: this.submit }, Validators.required],
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
      .pipe(
        switchMap(() => this.authService.getDefaultProjectId()),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(() => {
        this.submit = false;
        this.route.navigate(["/"], {});
        this.prepMain();
      });
  }

  prepMain(){
    const elementById = document.getElementById("resizable");
    if (elementById.classList.contains("hide")) {
      elementById.classList.remove("hide");
      if (elementById.classList.contains("toggle"))elementById.classList.remove('toggle');
    } //hide sidebar
    else elementById.classList.add("hide");
  }

  auth() {
    this.route.navigate(['/login'])
  }

  registration() {
    this.submit = true;
    const loginModel = new RegistrationModel();
    loginModel.login = this.form.get("login").value;
    loginModel.name = this.form.get("name").value;
    loginModel.email = this.form.get("email").value;
    this.authService.registration(loginModel).subscribe(
      res => {
        this.error = true;
        this.errorMessage = 'Пароль выслан на указанную почту';
        this.submit = false;
      },
      () => {
        this.error = true;
        this.errorMessage = 'Пользователь уже существует'
        this.submit = false;
      }
      )
  }
}
