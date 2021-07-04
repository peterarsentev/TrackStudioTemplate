import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../../../shared/services/message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-discussion',
  templateUrl: './create-discussion.component.html',
  styleUrls: ['./create-discussion.component.scss']
})
export class CreateDiscussionComponent implements OnInit, OnDestroy {

  form: FormGroup;
  private unsubscribe$ = new Subject();
  constructor(private fb: FormBuilder,
              private router: Router,
              private messageService: MessageService) { }

  ngOnInit() {
    this.buildForm();
  }


  private buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  setDescription(text: string) {
    this.form.get('description').setValue(text);
  }

  save() {
    const name = this.form.get('name').value;
    const description = this.form.get('description').value;
    this.messageService.create(name, description)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.router.navigate(['discuss', `${res.id}`]))
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
