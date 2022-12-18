import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RatingResponse } from '../../../../shared/models/rating.response';
import { RatingService } from '../rating.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class RatingLikesResolver implements Resolve<RatingResponse> {
  constructor(private ratingService: RatingService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<RatingResponse> | Promise<RatingResponse> | RatingResponse {
    return this.ratingService.geUsersByLikes(0);
  }
}
