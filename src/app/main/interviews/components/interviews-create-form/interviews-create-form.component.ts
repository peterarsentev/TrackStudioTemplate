import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InterviewModel } from '../../../../shared/models/interview.model';
import { InterviewsService } from '../../interviews.service';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService } from '../../../../shared/services/nav.service';

@Component({
  selector: 'app-interviews-create-form',
  templateUrl: './interviews-create-form.component.html',
  styleUrls: ['./interviews-create-form.component.scss']
})
export class InterviewsCreateFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  unsubscribe$: Subject<void> = new Subject();
  private interview: InterviewModel;
  dateError = false;

  validationErrors = {
    title: [
      { type: 'required', message: 'Введите тему собеседования'}
    ],
    date: [
      { type: 'required', message: 'Введите дату собеседования'}
    ],
    contactBy: [
      { type: 'required', message: 'Введите способ связи'}
    ],
    description: [
      { type: 'required', message: 'Введите вопросы'}
    ],
    type: [
      { type: 'required', message: 'Введите формат собеседования'}
    ],
  };
  constructor(private fb: FormBuilder,
              private interviewsService: InterviewsService,
              private router: Router,
              private route: ActivatedRoute,
              private navService: NavService) { }

  ngOnInit() {
    this.buildForm();
    this.navService.setUpModel({name: 'Новое собеседование', url: '/interviews/new', interview: true});

    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: InterviewModel) => {
      if (res) {
        this.interview = res;
        this.populateForm();
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      contactBy: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  setDescription(text: string) {
    this.form.get('description').setValue(text);
  }

  save() {
    if (this.form.valid && !this.dateError) {
      const interview = { ... new InterviewModel(),
        title: this.form.get('title').value,
        approximateDate: this.form.get('date').value,
        contactBy: this.form.get('contactBy').value,
        description: this.form.get('description').value,
        typeInterview: this.form.get('type').value,
      };
      let ob;
      if (!!this.interview && !!this.interview.id) {
        interview.id = this.interview.id;
        ob = this.interviewsService.update(interview);
      } else {
        ob = this.interviewsService.create(interview);
      }
      ob.pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => this.router.navigate(['interviews']));
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private populateForm() {
    this.form.get('title').setValue(this.interview.title);
    this.form.get('date').setValue(this.interview.approximateDate);
    this.form.get('contactBy').setValue(this.interview.contactBy);
    this.form.get('description').setValue(this.interview.description);
    this.form.get('type').setValue(this.interview.type);
  }
}
