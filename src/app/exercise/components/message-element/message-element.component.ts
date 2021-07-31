import { Component, Input, OnInit } from '@angular/core';
import { MessagesModel } from '../../../shared/models/messages.model';
import { UserModels } from '../../../shared/models/user.models';
import { TasksService } from '../../../shared/services/tasks.service';

@Component({
  selector: 'app-message-element',
  templateUrl: './message-element.component.html',
  styleUrls: ['./message-element.component.scss']
})
export class MessageElementComponent implements OnInit {

  @Input()message: MessagesModel;
  @Input()user: UserModels;
  @Input()taskId: number;
  edit = false;
  newText: string;
  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.newText = this.message.message.text;
  }

  editMessage() {
    this.edit = true;
  }

  updateComment(text: string) {
    this.newText = text;
  }

  cancel() {
    this.edit = false;
  }

  update() {
    if (this.newText) {
      console.log(this.newText, this.message.message.id, this.taskId);
      this.edit = false;
      this.tasksService.updateOperation(this.message, this.newText, this.taskId)
        .subscribe(res => {
          this.message.message = res;
          this.newText = this.message.message.text;
        });
    }
  }
}
