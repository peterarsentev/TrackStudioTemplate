import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseListComponent } from './components/exercise-list/exerciseList.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TasksListResolve } from './components/tasks-list/tasks.list.resolve';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { TopicResolver } from './components/exercise-list/topic-resolver.service';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ExerciseListComponent , resolve: { data: TopicResolver }},
      { path: ':topicId', component: TasksListComponent, resolve: { data: TasksListResolve } },
      { path: 'search/:search', component: TasksListComponent, resolve: { data: TasksListResolve } },
      { path: ':topicId/task-view/:id', component: TaskViewComponent },
      { path: ':topicId/task-view/:id/solutionId/:solutionId', component: TaskViewComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExerciseRoutingModule {

}
