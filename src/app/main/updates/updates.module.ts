import { NgModule } from '@angular/core';
import { UpdatedTasksComponent } from './components/updated-tasks/updated-tasks.component';
import { UpdatesRoutingModule } from './updates.routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    UpdatedTasksComponent
  ],
  imports: [UpdatesRoutingModule, CommonModule, SharedModule, InfiniteScrollModule]
})
export class UpdatesModule {}
