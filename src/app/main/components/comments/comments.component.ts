import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { UserModels } from '../../../shared/models/user.models';
import { Subject } from 'rxjs';
import { CommentService } from '../../../shared/services/comment.service';
import { CommentAndButtonsModel } from '../../../shared/models/commentAndButtonsModel';

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
  @Output() save: EventEmitter<CommentAndButtonsModel> = new EventEmitter<CommentAndButtonsModel>();
  @Input() handlers: UserModels[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  disabled: boolean;
  validationErrors = {
    handlerId: [
      { type: 'required', message: 'Ответственный'}
    ],
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private tasksService: TasksService) {}

  ngOnInit() {
    this.initForm();
    this.handlers.forEach(user => user.name === 'Петр Арсентьев' ?  this.form.get('handlerId').setValue(user.id) : null);
  }

  private initForm() {
    this.form = this.fb.group({
      description: [''],
      handlerId: ['', Validators.required]
    });
  }

  submitComment(button: CommentAndButtonsModel) {
    this.disabled = true;
    const handlerId = this.form.get('handlerId').value;
    const description = this.form.get('description').value;
    this.save.emit({...button, handlerId, description});
    this.form.reset();

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
    this.save.emit({ close: true });
  }
}
