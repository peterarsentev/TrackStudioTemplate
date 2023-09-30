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
  scrollDistance = 5;
  throttle = 300;
  unsubscribe$: Subject<void> = new Subject();
  ratings: RatingModel[];
  private hasNext: boolean;
  user: UserModels;
  private ids: number[] = [];

  constructor(private route: ActivatedRoute,
              private userStore: UserService,
              private ratingService: RatingService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.data
      .pipe(
        pluck('data'),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res: RatingResponse) => {
        res.ratings.forEach(r => this.ids.push(r.userId));
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
          res.ratings.forEach(r => {
            if (!this.ids.find(id => r.userId === id)) {
              this.ids.push(r.userId);
              this.ratings.push(r);
            }
          });
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
