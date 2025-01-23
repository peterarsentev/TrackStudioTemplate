import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { InterviewsRoutingModule } from './interviews-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InterviewsListComponent } from './components/interviews-list/interviews-list.component';
import { InterviewsCreateFormComponent } from './components/interviews-create-form/interviews-create-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InterviewComponent } from './components/interview/interview.component';
import { NotificationsComponent } from './components/notifications/notifications.component';


@NgModule({
  declarations: [
    InterviewsListComponent,
    InterviewsCreateFormComponent,
    InterviewComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InterviewsRoutingModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ]
})
export class InterviewsModule { }
