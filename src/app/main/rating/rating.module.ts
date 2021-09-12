import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { SharedModule } from '../../shared/shared.module';
import { RatingRoutingModule } from './rating-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  declarations: [
    RatingListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RatingRoutingModule,
    InfiniteScrollModule
  ]
})
export class RatingModule { }
