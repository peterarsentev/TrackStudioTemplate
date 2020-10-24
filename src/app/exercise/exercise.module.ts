import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ExerciseRoutingModule } from './exercise.routing.module';
import { ExerciseListComponent } from './components/exercise-list/exerciseList.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TaskViewComponent } from './components/task-view/task-view.component';



@NgModule({
  declarations: [
    ExerciseListComponent,
    TasksListComponent,
    TaskViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExerciseRoutingModule
  ]
})
export class ExerciseModule { }
