import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseListComponent } from './components/exercise-list/exerciseList.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TasksListResolve } from './components/tasks-list/tasks.list.resolve';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { TopicResolver } from './components/exercise-list/topic-resolver.service';
import { SolutionsComponent } from '../main/solutions/components/solutions/solutions.component';
import { SolutionsResolver } from '../main/solutions/components/solutions/solutions.resolver';
import { StudentSolutionComponent } from '../main/solutions/components/student-solution/student-solution.component';
import { StudentResolver } from '../main/solutions/components/student-solution/student.resolver';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ExerciseListComponent , resolve: { data: TopicResolver }},
      { path: ':topicId', component: TasksListComponent, resolve: { data: TasksListResolve } },
      { path: 'search/:search', component: TasksListComponent, resolve: { data: TasksListResolve } },
      { path: ':topicId/task-view/:id', component: TaskViewComponent },
      { path: ':topicId/task-view/:id/solutions', component: SolutionsComponent, resolve: {data: SolutionsResolver}},
      { path: ':topicId/task-view/:id/solutions/:solutionId', component: StudentSolutionComponent, resolve: {data: StudentResolver}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExerciseRoutingModule {

}
