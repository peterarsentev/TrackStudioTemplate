import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RatingModel } from '../../../../shared/models/rating.model';
import { UserModels } from '../../../../shared/models/user.models';
import { RatingService } from '../rating.service';
import { pluck, takeUntil } from 'rxjs/operators';
import { RatingResponse } from '../../../../shared/models/rating.response';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-rating-likes-list',
  templateUrl: './rating-likes-list.component.html',
  styleUrls: ['./rating-likes-list.component.scss']
})
export class RatingLikesListComponent implements OnInit {
  page = 0;
  paginationAllowed = true;
  scrollDistance = 2;
  throttle = 300;
  unsubscribe$: Subject<void> = new Subject();
  ratings: RatingModel[];
  private hasNext: boolean;
  user: UserModels;

  constructor(private ratingService: RatingService,
              private router: Router,
              private route: ActivatedRoute, private userStore: UserService) { }

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
      this.ratingService.geUsersByLikes(this.page)
        .subscribe(res => {
          this.ratings = this.ratings.concat(res.ratings);
          this.hasNext = res.hasNext;
          this.paginationAllowed = res.hasNext;
        });
    }
  }

  goTo(r: RatingModel) {
    this.router.navigate(['user', r.userId], { state: { login: r.name } });
  }
}
