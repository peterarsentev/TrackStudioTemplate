import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { TopicsComponent } from './topics/topics.component';
import { TaskCodeListComponent } from './task-code/task-code-list.component';
import { TaskCodeFormComponent } from './task-code-form/task-code-form.component';
import { TaskCodeSolutionComponent } from './task-code-solution/task-code-solution.component';
import { TaskCodeRoutingModule } from './task.code.routing.module';

@NgModule({
  declarations: [
    TopicsComponent,
    TaskCodeListComponent,
    TaskCodeFormComponent,
    TaskCodeSolutionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TaskCodeRoutingModule
  ],
  exports: [
  ],
  providers: [],
})
export class TaskCodeModule {

}
