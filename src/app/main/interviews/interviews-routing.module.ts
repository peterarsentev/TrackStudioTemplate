import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterviewsListComponent } from './components/interviews-list/interviews-list.component';
import { InterviewsCreateFormComponent } from './components/interviews-create-form/interviews-create-form.component';
import { InterviewComponent } from './components/interview/interview.component';
import { InterviewResolver } from './components/interview/interview.resolver';

const routes: Routes = [
   { path: '', component: InterviewsListComponent,
 //    resolve: {data: }
   },
   { path: 'new', component: InterviewsCreateFormComponent},
   { path: 'view/:id', component: InterviewComponent, resolve: {data: InterviewResolver}}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  })
export class InterviewsRoutingModule {
}
