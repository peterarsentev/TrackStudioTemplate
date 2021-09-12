import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RatingService } from '../rating.service';
import { Injectable } from '@angular/core';
import { RatingResponse } from '../../../../shared/models/rating.response';

@Injectable({providedIn: 'root'})
export class RatingListResolve implements Resolve<RatingResponse> {
  constructor(private ratingService: RatingService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<RatingResponse> | Promise<RatingResponse> | RatingResponse {
    return this.ratingService.getRating(0);
  }

}
