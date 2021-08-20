import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ProjectElementListComponent } from './components/project-element-list/project-element-list.component';
import { ProjectViewComponent } from './components/project-view/project-view.component';



@NgModule({
  declarations: [ProjectsListComponent, ProjectElementListComponent, ProjectViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
