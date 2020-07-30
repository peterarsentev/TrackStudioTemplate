import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseListComponent } from './components/exercise-list/exerciseList.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TasksListResolve } from './components/tasks-list/tasks.list.resolve';
import { TaskViewComponent } from './components/task-view/task-view.component';

const routes: Routes = [
  {
    path:'',
    children: [
      { path: '', component: ExerciseListComponent },
      { path: ':id', component: TasksListComponent, resolve: {data: TasksListResolve} },
      { path: 'task-view/:id', component: TaskViewComponent }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExerciseRoutingModule {

}
