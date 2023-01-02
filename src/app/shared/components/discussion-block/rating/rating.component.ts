import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserModels } from '../../../models/user.models';
import { DiscussionMessageModel } from '../../../models/discussionMessageModel';
import { RateModel } from '../../../models/rate.model';
import { takeUntil } from 'rxjs/operators';
import { DiscussRatingService } from '../../../services/discussRatingService';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit, OnDestroy {
  @Input() user: UserModels;
  @Input() discussion: DiscussionMessageModel;

  rating: RateModel;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private discussRateService: DiscussRatingService) {
  }

  ngOnInit() {
    this.getRate();
  }

  private getRate() {
    this.discussRateService.getRate(+ this.discussion.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.rating = res.rate;
      });
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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
