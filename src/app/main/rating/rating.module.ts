import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { SharedModule } from '../../shared/shared.module';
import { RatingRoutingModule } from './rating-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RatingLikesListComponent } from './components/rating-likes-list/rating-likes-list.component';



@NgModule({
  declarations: [
    RatingListComponent,
    RatingLikesListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RatingRoutingModule,
    InfiniteScrollModule
  ]
})
export class RatingModule { }
