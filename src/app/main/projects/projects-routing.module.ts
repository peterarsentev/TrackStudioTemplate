import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ProjectResolver } from './components/projects-list/project.resolver';

const routes: Routes = [
  {path: '', component: ProjectsListComponent, resolve: {data: ProjectResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {

}
