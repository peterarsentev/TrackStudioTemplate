import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolutionsComponent } from './components/solutions/solutions.component';
import { SolutionsResolver } from './components/solutions/solutions.resolver';
import { StudentSolutionComponent } from './components/student-solution/student-solution.component';
import { StudentResolver } from './components/student-solution/student.resolver';

const routes: Routes = [
  {
    path: ':taskId', component: SolutionsComponent, resolve: {data: SolutionsResolver}
  },
  {
    path: ':taskId/:authorId/:solutionId', component: StudentSolutionComponent, resolve: {data: StudentResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolutionsRoutingModule {

}
