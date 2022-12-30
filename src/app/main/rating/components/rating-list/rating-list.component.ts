import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RatingModel } from '../../../../shared/models/rating.model';
import { RatingResponse } from '../../../../shared/models/rating.response';
import { RatingService } from '../rating.service';
import { UserService } from '../../../../shared/services/user.service';
import { UserModels } from '../../../../shared/models/user.models';

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.scss']
})
export class RatingListComponent implements OnInit, OnDestroy{

  page = 0;
  paginationAllowed = true;
  scrollDistance = 2;
  throttle = 300;
  unsubscribe$: Subject<void> = new Subject();
  ratings: RatingModel[];
  private hasNext: boolean;
  user: UserModels;

  constructor(private route: ActivatedRoute,
              private userStore: UserService,
              private ratingService: RatingService) { }

  ngOnInit() {
    this.route.data
      .pipe(
        pluck('data'),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res: RatingResponse) => {
        this.ratings = res.ratings;
        this.hasNext = res.hasNext;
      });
    window.scrollTo(0, 0);
    this.userStore.getModel()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.user = res);
  }

  onScrollDown() {
    if (this.hasNext) {
      this.page++;
      this.ratingService.getRating(this.page)
        .subscribe(res => {
          this.ratings = this.ratings.concat(res.ratings);
          this.hasNext = res.hasNext;
          this.paginationAllowed = res.hasNext;
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
