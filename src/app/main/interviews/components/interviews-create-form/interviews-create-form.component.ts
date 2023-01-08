import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InterviewModel } from '../../../../shared/models/interview.model';
import { InterviewsService } from '../../interviews.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NavService } from '../../../../shared/services/nav.service';

@Component({
  selector: 'app-interviews-create-form',
  templateUrl: './interviews-create-form.component.html',
  styleUrls: ['./interviews-create-form.component.scss']
})
export class InterviewsCreateFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  unsubscribe$: Subject<void> = new Subject();
  constructor(private fb: FormBuilder,
              private interviewsService: InterviewsService,
              private router: Router, private navService: NavService) { }

  ngOnInit() {
    this.buildForm();
    this.navService.setUpModel({name: 'Новое собеседование', url: '/interviews/new', interview: true});
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
    if (this.form.valid) {
      const interview = { ... new InterviewModel(),
        title: this.form.get('title').value,
        approximateDate: this.form.get('date').value,
        contactBy: this.form.get('contactBy').value,
        description: this.form.get('description').value,
        typeInterview: this.form.get('type').value
      };
      this.interviewsService.create(interview)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => this.router.navigate(['interviews']));
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
