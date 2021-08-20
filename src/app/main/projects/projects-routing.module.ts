import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ProjectResolver } from './components/projects-list/project.resolver';
import { ProjectViewComponent } from './components/project-view/project-view.component';
import { ProjectViewResolver } from './components/project-view/project.view.resolver';

const routes: Routes = [
  {path: '', component: ProjectsListComponent, resolve: {data: ProjectResolver}},
  { path: 'project-view/:projectId', component: ProjectViewComponent, resolve: {data: ProjectViewResolver} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {

}
