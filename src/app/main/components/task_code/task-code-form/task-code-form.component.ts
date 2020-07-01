import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskCodeModel } from '../../../../shared/models/task.code.models';


@Component({
  selector: 'app-task-code-form',
  templateUrl: './task-code-form.component.html',
  styleUrls: ['./task-code-form.component.scss']
})
export class TaskCodeFormComponent implements OnInit {
  @Input()taskModel: TaskCodeModel = {}
  @Input() taskClass: string;
  @Input() taskTest: string;
  @Input() status: number;
  @Input() set output(output: string) {
    if (!!output) {
      this.textArea = true;
      this.text = output;
    }
  };
  @Input() set  readOnlyClassCode(readOnlyClassCode: boolean) {
    this.options[`readOnly`] = readOnlyClassCode;
  };
  @Output() startTaskEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitTaskEmitter: EventEmitter<string> = new EventEmitter<string>();
  textArea: boolean;
  text: string;
  options = {
    lineNumbers: true,
    readOnly: this.readOnlyClassCode,
    mode: 'text/x-java',
  };

  optionsTest = {
    lineNumbers: true,
    readOnly: true,
    mode: 'text/x-java'
  };

  constructor() {}

  ngOnInit() {}

  start() {
    this.startTaskEmitter.emit();
  }

  submit(taskClass: string) {
    this.submitTaskEmitter.emit(taskClass);
  }
}
