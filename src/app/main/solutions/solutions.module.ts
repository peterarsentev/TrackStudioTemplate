import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { SolutionsRoutingModule } from './solutions-routing.module';
import { SolutionsComponent } from './components/solutions/solutions.component';
import { StudentSolutionComponent } from './components/student-solution/student-solution.component';

@NgModule({
  declarations: [
    SolutionsComponent,
    StudentSolutionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SolutionsRoutingModule
  ]
})
export class SolutionsModule {

}
