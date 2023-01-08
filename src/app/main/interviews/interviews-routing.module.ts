import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterviewsListComponent } from './components/interviews-list/interviews-list.component';
import { InterviewsCreateFormComponent } from './components/interviews-create-form/interviews-create-form.component';
import { InterviewComponent } from './components/interview/interview.component';
import { InterviewResolver } from './components/interview/interview.resolver';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { InterviewForUpdateResolver } from './components/interviews-create-form/interview.update.resolver';

const routes: Routes = [
   { path: '', component: InterviewsListComponent,
 //    resolve: {data: }
   },
   { path: 'new', component: InterviewsCreateFormComponent},
   { path: 'view/:id', component: InterviewComponent, resolve: {data: InterviewResolver}},
   { path: 'edit/:id', component: InterviewsCreateFormComponent, resolve: {data: InterviewForUpdateResolver}},
   { path: 'notifications', component: NotificationsComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  })
export class InterviewsRoutingModule {
}
