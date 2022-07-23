import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksByStatusComponent } from './components/tasks-by-status/tasks-by-status.component';
import { TaskByStatusResolver } from './components/task-by-status-resolver';


const routes: Routes = [
  {
    path: ':status', component: TasksByStatusComponent, resolve: {data: TaskByStatusResolver}
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksByStatusRoutingModule {

}
