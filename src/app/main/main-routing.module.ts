import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TaskComponent } from './components/task/task.component';
import { TasksComponent } from './components/tasks/tasks.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full'}, // позволяет загрузить и  дочерний роут
      { path: '', component: NavigationComponent, children: [

          {path: 'tasks', component: TasksComponent},
        ] },
      { path: 'login', component: LoginComponent },
      {path: 'task',  component: TaskComponent},
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
