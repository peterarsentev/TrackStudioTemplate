import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DiscussionMessageModel } from '../../../models/discussionMessageModel';
import { UserModels } from '../../../models/user.models';
import { ModalService, TypeModals } from '../../../modal.service';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DiscussRatingService } from '../../../services/discussRatingService';
import { RateModel } from '../../../models/rate.model';
import {Route, Router} from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-discussion-element]',
  templateUrl: './discussion-element.component.html',
  styleUrls: ['./discussion-element.component.scss']
})
export class DiscussionElementComponent implements OnInit, OnDestroy {
  @Input() discussion: DiscussionMessageModel;
  @Input() canResponse = true;
  @Input() user: UserModels;
  @Output() response: EventEmitter<DiscussionMessageModel> = new EventEmitter<DiscussionMessageModel>();
  @Output() deleteEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateEmitter: EventEmitter<any> = new EventEmitter<any>();
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  rating: RateModel = {};
  showDiscussion = false;
  addResponse = false;
  answers: boolean;
  constructor(private modalService: ModalService,
              private discussRateService: DiscussRatingService,
              private router: Router) { }

  ngOnInit() {
  }

  openConfirmModal(d?: DiscussionMessageModel) {
    this.modalService.openDialog(TypeModals.ARE_YOU_SURE, {title: 'Удалить сообщение',
      text: 'Вы уверены что хотите удалить сообщение?', button: 'Удалить' })
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          if (!!d) {
            this.deleteEmitter.emit(d);
          } else {
            this.deleteEmitter.emit(this.discussion);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  update(newText: any, d?: DiscussionMessageModel) {
    console.log(d, newText);
    if (!!d && !newText) {
      d.editResponse = false;
      return;
    }
    if (!!d && !!newText) {
      d.text = newText;
      d.editResponse = false;
      this.updateEmitter.emit(d);
      return;
    }
    if (newText) {
      this.discussion.text = newText;
      this.updateEmitter.emit(this.discussion);
    }
    this.showDiscussion = false;
  }

  change() {
    this.showDiscussion = true;
  }

  showAddResponseForm() {
    this.addResponse = true;
  }

  addNewResponse(data: string) {
    this.addResponse = false;
    const newResp = {...this.discussion, id: undefined, parentId: this.discussion.id, text: data};
    this.response.emit(newResp);
  }

  showAnswers() {
    this.answers = !this.answers;
  }

  changeResponse(d: DiscussionMessageModel) {
    d.editResponse = true;
  }

  goToProfile(userId: string) {
    this.router.navigate(['user', userId])
      .then(() => window.scrollTo(0, 0));
  }
}
