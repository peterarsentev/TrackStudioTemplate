import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {SolutionCommunityPublishComponent} from './solution-community-publish/solution-community-publish.component';
import {SolutionCommunityItemComponent} from './solution-community-item/solution-community-item.component';
import {SolutionCommunityListComponent} from './solution-community-list/solution-community-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: SolutionCommunityListComponent },
      { path: 'publish/:typeResource/:resourceId', component:  SolutionCommunityPublishComponent },
      { path: 'item/:solutionCommunityId', component:  SolutionCommunityItemComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolutionCommunityRoutingModule {

}
