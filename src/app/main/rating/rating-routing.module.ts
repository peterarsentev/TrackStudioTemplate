import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { RatingListResolve } from './components/rating-list/rating-list-resolve';

const routes: Routes = [
  { path: '', component: RatingListComponent, resolve: {data: RatingListResolve}}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  })
export class RatingRoutingModule {
}
