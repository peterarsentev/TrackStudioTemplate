import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserModels } from '../../../shared/models/user.models';
import { TasksService } from '../../../shared/services/tasks.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit, OnDestroy {

  validationErrors = {
    handlerId: [
      { type: 'required', message: 'Ответственный'}
    ],
    description: [
      { type: 'required', message: 'Введите описание'}
    ]
  };
  form: FormGroup;
  taskId: string;
  mstatusId: string;
  handlers: UserModels[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private tasksService: TasksService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.getRoutParams();
  }

  private getRoutParams() {
    this.route.queryParams.pipe(
      switchMap(url => {
        this.taskId = url.taskId;
        this.mstatusId = url.mstatusId;
        return this.tasksService.getResponsePersonsForTask(this.taskId, this.mstatusId);
      }),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(handlers => {
      this.handlers = handlers.handlers;
      this.handlers.forEach(user => user.name === 'Петр Арсентьев' ?  this.form.get('handlerId').setValue(user.id) : null)
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  submitTask() {
    this.tasksService.createTask(this.taskId, this.mstatusId, this.form.get('name').value, this.form.get('description').value)
      .subscribe(res => {
        console.log(res);
        this.router.navigate(['/task'], {
          queryParams: {
            action: 'task',
            taskId: res.task.id
          }
        });
      });
  }

  selectPerson(user: UserModels) {
    this.form.get('handlerId').setValue(user.id);
  }

  setDescription(text: string) {
    this.form.get('description').setValue(text);
  }

  private initForm() {
    this.form = this.fb.group({
      handlerId: ['', Validators.required],
      name:['', Validators.required],
      description: ['', Validators.required]
    });
  }

}
