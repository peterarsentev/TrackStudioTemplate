import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { RatingListResolve } from './components/rating-list/rating-list-resolve';
import { RatingLikesListComponent } from './components/rating-likes-list/rating-likes-list.component';
import { RatingLikesResolver } from './components/rating-likes-list/ratingLikesResolver';

const routes: Routes = [
  { path: '', component: RatingListComponent, resolve: {data: RatingListResolve}},
  { path: 'likes', component: RatingLikesListComponent, resolve: {data: RatingLikesResolver}}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  })
export class RatingRoutingModule {
}
