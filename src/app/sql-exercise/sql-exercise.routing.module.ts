import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SqlExerciseTopicListComponent } from './components/sql-exercise-topic-list/sql-exercise-topic-list.component';
import { SqlExerciseListComponent } from './components/sql-exercise-list/sql-exercise-list.component';
import { SqlExerciseComponent } from './components/sql-exercise/sql-exercise.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: SqlExerciseTopicListComponent },
      { path: ':topicId', component: SqlExerciseListComponent },
      { path: ':topicId/show/:id', component: SqlExerciseComponent }
      // { path: ':topicId', component: TaskCodeListComponent },
      // { path: ':topicId/task_code/:task_code_id/solution/:solutionId', component:  TaskCodeSolutionComponent}
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SqlExerciseRoutingModule {

}
