import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { TaskComponent } from './components/task/task.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { CommentsComponent } from './components/comments/comments.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { MessagesComponent } from './components/messages/messages.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { ExamComponent } from './components/exam/exam.component';
import { TaskNotFoundComponent } from './components/task-not-found/task-not-found.component';
import { TaskAccessComponent } from './components/task-access/task-access.component';
import { ErrorComponent } from './components/error/error.component';
import { RegistrationComponent } from './components/registration/registration.component';
import {PaymentComponent} from './components/payment/payment.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {path: '', component: MainPageComponent},
      {path: 'taskNotFound', component: TaskNotFoundComponent},
      {path: 'taskAccess', component: TaskAccessComponent},
      {path: 'error', component: ErrorComponent},
      {path: 'task', component: TaskComponent},
      {path: 'tasks', component: TasksComponent},
      {path: 'comments', component: CommentsComponent},
      {path: 'new-task', component: NewTaskComponent},
      {path: 'messages', component: MessagesComponent},
      {path: 'sandbox', component: SandboxComponent},
      {path: 'exams', component: ExamComponent},
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module')
          .then(mod => mod.ProfileModule)
      },
      {
        path: 'vacancies',
        loadChildren: () => import('../vacancies/vacancies.module')
          .then(mod => mod.VacanciesModule)
      },
      {
        path: 'exercise',
        loadChildren: () => import('../exercise/exercise.module')
          .then(mod => mod.ExerciseModule)
      },
      {
        path: 'topics',
        loadChildren: () => import('../task_code/task.code.module')
          .then(mod => mod.TaskCodeModule)
      },
      {
        path: 'discuss',
        loadChildren: () => import('../main/discuss/discuss.module')
          .then(mod => mod.DiscussModule)
      },
      {path: 'payment', component: PaymentComponent},
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {

}
