import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdatedTasksComponent } from './components/updated-tasks/updated-tasks.component';
import {BlocksComponent} from './components/blocks/blocks.component';

const routes: Routes = [
  {path: '', component: UpdatedTasksComponent},
  {path: 'blocks', component: BlocksComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdatesRoutingModule {}
