import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscussListComponent } from './components/discuss-list/discuss-list.component';
import { DiscussListResolver } from './components/discuss-list/discuss.list.resolver';
import { DiscussListElementComponent } from './components/discuss-list-element/discuss-list-element.component';
import { DiscussElementResolver } from './components/discuss-list-element/discuss.element.resolver';
import { DiscussNotificationComponent } from './components/discuss-notification/discuss-notification.component';
import { DiscussNotificationResolve } from './components/discuss-notification/discuss.notification.resolve';


const routes: Routes = [
  { path: ':all', component: DiscussListComponent, resolve: { data: DiscussListResolver } },
 // { path: 'my', component: DiscussListComponent, resolve: { data: DiscussListResolver } },
  { path: 'notifications', component: DiscussNotificationComponent, resolve: {data: DiscussNotificationResolve} },
  { path: ':all/:id', component: DiscussListElementComponent, resolve: { data: DiscussElementResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussRoutingModule {

}
