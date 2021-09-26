import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlExerciseTopicListComponent } from './components/sql-exercise-topic-list/sql-exercise-topic-list.component';
import { SqlExerciseRoutingModule } from './sql-exercise.routing.module';
import { SharedModule } from '../shared/shared.module';
import { SqlExerciseListComponent } from './components/sql-exercise-list/sql-exercise-list.component';
import { SqlExerciseComponent } from './components/sql-exercise/sql-exercise.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [SqlExerciseTopicListComponent, SqlExerciseListComponent, SqlExerciseComponent],
  imports: [
    CommonModule,
    SharedModule,
    SqlExerciseRoutingModule
  ]
})
export class SqlExerciseModule { }
