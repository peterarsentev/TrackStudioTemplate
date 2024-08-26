import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SolutionCommunityRoutingModule} from './solution-community-routing.module';
import {SolutionCommunityListComponent} from './solution-community-list/solution-community-list.component';
import {SolutionCommunityItemComponent} from './solution-community-item/solution-community-item.component';
import {SolutionCommunityPublishComponent} from './solution-community-publish/solution-community-publish.component';
import {SharedModule} from '../shared/shared.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    SolutionCommunityListComponent,
    SolutionCommunityItemComponent,
    SolutionCommunityPublishComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    SolutionCommunityRoutingModule
  ]
})
export class SolutionCommunityModule { }
