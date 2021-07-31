import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
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
  replay: string;
  @Output() closeEmitter: EventEmitter<any> = new EventEmitter<string>();
  showDiscussion: boolean;
  constructor() { }

  ngOnInit() {
  }

  showDiscussionForm() {
    this.showDiscussion = !this.showDiscussion;
  }

  closeDiscussion(event: any) {
    // this.showDiscussion = false;
    console.log(event)
    this.closeEmitter.emit(event);
  }

  openAndReplay(discussion: DiscussionMessageModel) {
    this.replay = '<p>Сообщение от ' + '<b>' + discussion.name + '</b></p> '  + discussion.text;
    this.replay = this.replay + '<hr><p><br></p>';
    this.showDiscussion = !this.showDiscussion;
    window.scrollTo(0, document.body.scrollHeight);
  }
}
