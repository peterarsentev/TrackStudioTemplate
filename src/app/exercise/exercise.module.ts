import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ExerciseRoutingModule } from './exercise.routing.module';
import { ExerciseListComponent } from './components/exercise-list/exerciseList.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { MessageElementComponent } from './components/message-element/message-element.component';
import { SolutionsComponent } from '../main/solutions/components/solutions/solutions.component';
import { StudentSolutionComponent } from '../main/solutions/components/student-solution/student-solution.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {TaskExerciseModel} from '../shared/models/task.exercise.model';
import {TaskExerciseComponent} from '../main/components/task-exercise/task-exercise.component';

@NgModule({
  declarations: [
    ExerciseListComponent,
    TasksListComponent,
    TaskViewComponent,
    TaskExerciseComponent,
    MessageElementComponent,
    SolutionsComponent,
    StudentSolutionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExerciseRoutingModule,
    InfiniteScrollModule
  ]
})
export class ExerciseModule { }
