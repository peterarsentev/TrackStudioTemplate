import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdatedTasksComponent } from './components/updated-tasks/updated-tasks.component';

const routes: Routes = [
  {path: '', component: UpdatedTasksComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdatesRoutingModule {}
