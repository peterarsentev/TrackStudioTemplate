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

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full'}, // позволяет загрузить и  дочерний роут
      { path: '', component: MainPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'task',  component: TaskComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'comments', component: CommentsComponent },
      { path: 'new-task', component: NewTaskComponent },
      { path: 'messages', component: MessagesComponent },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(mod => mod.ProfileModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {

}
