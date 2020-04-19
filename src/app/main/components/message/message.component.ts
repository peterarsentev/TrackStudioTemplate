import { Component, Input, OnInit } from '@angular/core';
import { MessagesModel } from '../../../shared/models/messages.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: MessagesModel;
  constructor() { }

  ngOnInit() {
  }

}
