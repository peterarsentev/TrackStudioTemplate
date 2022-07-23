import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksByStatusRoutingModule } from './tasks-by-status-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../../shared/shared.module';
import { TasksByStatusComponent } from './components/tasks-by-status/tasks-by-status.component';

@NgModule({
  declarations: [
    TasksByStatusComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TasksByStatusRoutingModule,
    InfiniteScrollModule
  ]
})
export class TasksByStatusModule { }
