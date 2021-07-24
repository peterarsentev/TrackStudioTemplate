import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VacancyModels } from '../../../shared/models/vacancy.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { UserModels } from '../../../shared/models/user.models';
import { VacancyService } from '../../vacancy.service';
import { pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-vacancy-details',
  templateUrl: './vacancy-details.component.html',
  styleUrls: ['./vacancy-details.component.scss']
})
export class VacancyDetailsComponent implements OnInit, OnDestroy {
  vacancy: VacancyModels;
  form: FormGroup;
  private user: UserModels;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private userService: UserService,
              private vacancyService: VacancyService) { }

  ngOnInit() {
    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(user => this.user = user);
    this.buildForm();
    this.route.data
      .pipe(pluck('data'), takeUntil(this.ngUnsubscribe$))
      .subscribe((res: VacancyModels) => {
        this.vacancy = res;
        if (this.vacancy.id) {
          this.populateForm();
        }
      });
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  setDescription(desc: string) {
    this.form.get('description').setValue(desc);
  }

  setOpen() {
    this.vacancy.open = !this.vacancy.open;
  }

  save() {
    this.vacancy.name = this.form.get('name').value;
    this.vacancy.description = this.form.get('description').value;
    if (!this.vacancy.id) {
      this.vacancyService.save(this.vacancy)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => this.router.navigate(['vacancies', 'view', `${res.id}`]));
    } else {
      this.vacancyService.update(this.vacancy)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => this.router.navigate(['vacancies', 'view', `${res.id}`]));
    }
  }

  private populateForm() {
    this.form = this.fb.group({
      name: [this.vacancy.name, Validators.required],
      description: [this.vacancy.description, Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
