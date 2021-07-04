import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscussRoutingModule } from './discuss-routing.module';
import { DiscussListComponent } from './components/discuss-list/discuss-list.component';
import { SharedModule } from '../../shared/shared.module';
import { DiscussListElementComponent } from './components/discuss-list-element/discuss-list-element.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CreateDiscussionComponent } from './components/create-discussion/create-discussion.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DiscussListComponent,
    DiscussListElementComponent,
    CreateDiscussionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    DiscussRoutingModule,
    ReactiveFormsModule
  ]
})
export class DiscussModule { }
