import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ProjectResolver } from './components/projects-list/project.resolver';
import {TaskViewComponent} from '../../exercise/components/task-view/task-view.component';
import {ProjectViewComponent} from './components/project-view/project-view.component';

const routes: Routes = [
  {path: '', component: ProjectsListComponent, resolve: {data: ProjectResolver}},
  { path: 'project-view/:projectId', component: ProjectViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {

}
