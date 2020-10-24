import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TopicsComponent } from './topics/topics.component';
import { TaskCodeListComponent } from './task-code/task-code-list.component';
import { TaskCodeSolutionComponent } from './task-code-solution/task-code-solution.component';

const routes: Routes = [
  {
    path:'',
    children: [
      { path: '', component: TopicsComponent },
      { path: ':topicId', component: TaskCodeListComponent },
       { path: ':topicId/task_code/:task_code_id/solution/:solutionId', component:  TaskCodeSolutionComponent}
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskCodeRoutingModule {

}
