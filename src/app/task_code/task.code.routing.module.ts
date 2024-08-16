import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TopicsComponent } from './topics/topics.component';
import { TaskCodeListComponent } from './task-code/task-code-list.component';
import { TaskCodeSolutionComponent } from './task-code-solution/task-code-solution.component';
import { TaskCodeSolutionsListComponent } from './task-code-solutions-list/task-code-solutions-list.component';
import { TaskCodeSolutionsResolver } from './task-code-solutions-list/task-code-solutions-resolver';
import { UserSolutionComponent } from './user-solution/user-solution.component';
import { UserSolutionResolver } from './user-solution/user-solution-resolver';
import {TaskCodeShareComponent} from './task-code-share/task-code-share.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: TopicsComponent },
      { path: ':topicId', component: TaskCodeListComponent },
       { path: ':topicId/task_code/:task_code_id/:solutionId', component:  TaskCodeSolutionComponent },
       { path: ':topicId/task_code/:task_code_id/:solutionId/solutions',
         component:  TaskCodeSolutionsListComponent, resolve: {data: TaskCodeSolutionsResolver} },
      { path: ':topicId/task_code/:task_code_id/:solutionId/solutions/:userId',
        component:  UserSolutionComponent, resolve: {data: UserSolutionResolver} },
      { path: ':topicId/task_code_share/:task_code_id/:solutionId', component:  TaskCodeShareComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskCodeRoutingModule {

}
