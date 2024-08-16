import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TaskCodeModel } from '../../shared/models/task.code.models';
import { NextPreviousSolutions } from '../../shared/models/nextPreviousSolutions';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { AlertService } from '../../shared/services/alertService';

@Component({
  selector: 'app-task-code-form',
  templateUrl: './task-code-form.component.html',
  styleUrls: ['./task-code-form.component.scss']
})
export class TaskCodeFormComponent implements OnInit, OnDestroy {
  previousAndNext: NextPreviousSolutions = {};
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  dis = false;
  @Input() taskModel: TaskCodeModel = {};
  @Input() taskClass: string;
  @Input() count: number;
  @Input() taskTest: string;
  @Input() explanation: string;
  @Input() status: number;
  private taskId: string;
  private solutionId: string;
  @Output() goToSolutions = new EventEmitter<boolean>();
  show = false;
  @Input() set output(output: string) {
    if (!!output) {
      this.textArea = true;
      this.text = output;
    }
  }
  @Input() set disabled(disabled: boolean) {
    this.dis = disabled;
  }
  @Output() startTaskEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitTaskEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() resetEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  textArea: boolean;
  text: string;
  options = {
    lineNumbers: true,
    readOnly: false,
    mode: 'text/x-java',
  };

  optionsTest = {
    lineNumbers: true,
    readOnly: true,
    mode: 'text/x-java'
  };

  optionsOutput = {
    lineNumbers: true,
    readOnly: true,
    mode: 'text/x-java'
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService,
              private taskService: TasksService) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
          this.taskId = params.task_code_id;
          this.solutionId = params.solutionId;
          return this.taskService.getNextPreviousSol(this.taskId);
        }),
        takeUntil(this.ngUnsubscribe$),
      ).subscribe(res => {
      this.previousAndNext = res;
    });
    setTimeout(() => {
      document.querySelectorAll('a img').forEach((block) => {
        block.parentElement.setAttribute('data-lightbox', 'images');
      });
    }, 0);
  }

  start() {
    this.startTaskEmitter.emit();
  }

  submit(taskClass: string) {
    this.submitTaskEmitter.emit(taskClass);
  }

  goTo(nav: TaskCodeModel) {
    window.scroll(0, 0);
    const solutionId = !!nav.solutionId ? nav.solutionId : 'new_task';
    this.alertService.setUpMessage(undefined);
    this.text = '';
    this.router.navigate(['topics', `${nav.topicId}`, 'task_code', `${nav.id}`, `${solutionId}`]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  reset() {
    this.resetEmitter.emit(true);
  }

  goToUserList() {
    this.goToSolutions.emit(true);
  }

  showExplanation() {
    this.show = !this.show;
  }
}
