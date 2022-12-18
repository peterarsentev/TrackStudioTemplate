import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DiscussionMessageModel } from '../../../models/discussionMessageModel';
import { UserModels } from '../../../models/user.models';
import { ModalService, TypeModals } from '../../../modal.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DiscussRatingService } from '../../../services/discussRatingService';
import { RateModel } from '../../../models/rate.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-discussion-element]',
  templateUrl: './discussion-element.component.html',
  styleUrls: ['./discussion-element.component.scss']
})
export class DiscussionElementComponent implements OnInit, OnDestroy {
  @Input() discussion: DiscussionMessageModel;
  @Input() user: UserModels;
  @Output() response: EventEmitter<DiscussionMessageModel> = new EventEmitter<DiscussionMessageModel>();
  @Output() deleteEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateEmitter: EventEmitter<any> = new EventEmitter<any>();
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  rating: RateModel = {};
  showDiscussion = false;
  addResponse = false;
  answers: boolean;
  constructor(private modalService: ModalService, private discussRateService: DiscussRatingService) { }

  ngOnInit() {
    this.getRate();
  }

  openConfirmModal() {
    this.modalService.openDialog(TypeModals.ARE_YOU_SURE, {title: 'Удалить сообщение',
      text: 'Вы уверены что хотите удалить сообщение?', button: 'Удалить' })
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.deleteEmitter.emit(this.discussion);
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  update(newText: any) {
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

  vote(accept: boolean) {
    if (accept && this.rating.vote === 'NO') {
      this.discussRateService.voteUp(+this.discussion.id)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (accept && this.rating.vote === 'DOWN' || !accept && this.rating.vote === 'UP') {
      this.discussRateService.voteClear(this.discussion.id)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (!accept && this.rating.vote === 'NO') {
      this.discussRateService.voteDown(this.discussion.id)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (accept && this.rating.vote === 'UP' || !accept && this.rating.vote === 'DOWN') {
      this.discussRateService.voteClear(this.discussion.id)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
  }

  private getRate() {
    this.discussRateService.getRate(+ this.discussion.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.rating = res.rate;
      });
  }
}
