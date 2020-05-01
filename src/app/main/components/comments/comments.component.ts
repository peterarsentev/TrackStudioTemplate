import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { UserModels } from '../../../shared/models/user.models';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {

  form: FormGroup;
  mstatusId: string;
  taskId: string;
  handlers: UserModels[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  validationErrors = {
    handlerId: [
      { type: 'required', message: 'Ответственный'}
    ],
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private tasksService: TasksService) {};

  ngOnInit() {
    this.initForm();
    this.getRoutParams();
  }

  private initForm() {
    this.form = this.fb.group({
      description: [''],
      handlerId: ['', Validators.required]
    });
  }

  submitComment() {
    const handlerId = this.form.get('handlerId').value;
    let description = this.form.get('description').value;
    this.tasksService.sendComment(this.taskId, this.mstatusId, handlerId, description)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.router.navigate(['/task'], {
          queryParams: {
            action: 'task',
            taskId: this.taskId
          }
        });
      })
  }

  private getRoutParams() {
    this.route.queryParams.pipe(
      switchMap(url => {
        this.taskId = url.taskId;
        this.mstatusId = url.mstatusId;
        return this.tasksService.gerResponsiblePeople(this.taskId, this.mstatusId);
      }),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(handlers => {
      this.handlers = handlers.handlers;
    })
  }

  selectPerson(user: UserModels) {
    this.form.get('handlerId').setValue(user.id);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  setDescription(text: string) {
    this.form.get('description').setValue(text);
  }
}
