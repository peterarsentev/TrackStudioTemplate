import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { UserModels } from '../../../shared/models/user.models';
import { Subject } from 'rxjs';
import { CommentService } from '../../../shared/services/comment.service';
import { CommentButtonsModel } from '../../../shared/models/comment.buttons.model';

declare var hljs: any;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {

  form: FormGroup;
  @Input() mstatusId: string;
  @Input() taskId: string;
  @Input() operation: string;
  @Output() save: EventEmitter<CommentButtonsModel> = new EventEmitter<CommentButtonsModel>();
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
              private commentService: CommentService,
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

  submitComment(button: CommentButtonsModel) {
    const handlerId = this.form.get('handlerId').value;
    let description = this.form.get('description').value;
    this.tasksService.sendComment(this.taskId, this.mstatusId, handlerId, description)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.commentService.setUpModel(true);
        this.form.reset();
        this.save.emit(button);
      })
  }

  private getRoutParams() {
    return this.tasksService.gerResponsiblePeople(this.taskId, this.mstatusId)
      .pipe( takeUntil(this.ngUnsubscribe$))
      .subscribe(handlers => {
      this.handlers = handlers.handlers;
      this.handlers.forEach(user => user.name === 'Петр Арсентьев' ?  this.form.get('handlerId').setValue(user.id) : null)
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

  closeForm() {
    this.form.reset();
    this.save.emit({ close: true })
  }
}
