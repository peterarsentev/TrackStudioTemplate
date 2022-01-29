import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiscussionMessageModel } from '../../models/discussionMessageModel';
import { UserModels } from '../../models/user.models';

@Component({
  selector: 'app-discussion-block',
  templateUrl: './discussion-block.component.html',
  styleUrls: ['./discussion-block.component.scss']
})
export class DiscussionBlockComponent implements OnInit {

  @Input() discussions: DiscussionMessageModel[] = [];
  @Input() user: UserModels;
  @Output() closeEmitter: EventEmitter<any> = new EventEmitter<string>();
  @Output() deleteEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateEmitter: EventEmitter<any> = new EventEmitter<any>();
  showDiscussion: boolean;
  needToShow: boolean;
  constructor() { }

  ngOnInit() {}

  showDiscussionForm() {
    this.showDiscussion = !this.showDiscussion;
  }

  closeDiscussion(event: any) {
    this.showDiscussion = false;
    this.closeEmitter.emit(event);
  }

  deleteDiscussion(discussion: DiscussionMessageModel) {
     this.deleteEmitter.emit(discussion);
  }

  update(event: any) {
    this.updateEmitter.emit(event);
  }

  show() {
    this.needToShow = !this.needToShow;
  }
}
