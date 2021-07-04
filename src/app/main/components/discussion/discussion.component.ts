import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {

  submit: boolean;
  @Input()taskId: number;
  form: FormGroup;
  @Output() closeEmitter: EventEmitter<any> = new EventEmitter<string>();

  constructor(private fb: FormBuilder,
              private messageService: MessageService) { }

  ngOnInit() {
    this.form = this.fb.group({
      text: ['']
    });
  }

  setDescription(text: string) {
    this.form.get('text').setValue(text);
  }

  submitComment() {
    this.submit = true;
    const text = this.form.get('text').value;
    this.closeEmitter.emit(text);
    this.form.get('text').setValue('');
  }

  closeForm() {
    this.closeEmitter.emit(false);
  }
}
