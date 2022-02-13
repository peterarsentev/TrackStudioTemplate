import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit {

  form: FormGroup;
  @Input() title: string;
  @Input() titleDesc: string;
  @Output() elementEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder) { }

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
    this.elementEmitter.emit({name, description});
  }
}
