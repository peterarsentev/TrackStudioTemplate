import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { MainPageComponent } from './components/main-page/main-page.component';
import { TaskComponent } from './components/task/task.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { CommentsComponent } from './components/comments/comments.component';
import { SafeCodePipe } from './safe-code.pipe';
import { MessageComponent } from './components/message/message.component';
import { GetDatePipe } from '../shared/get-date.pipe';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { ChartsModule } from 'ng2-charts';
import { DiagramComponent } from './components/diagramma/diagram.component';


@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    LoginComponent,
    MainPageComponent,
    TaskComponent,
    TasksComponent,
    NavigationComponent,
    FooterComponent,
    ProgressBarComponent,
    CommentsComponent,
    SafeCodePipe,
    MessageComponent,
    GetDatePipe,
    NewTaskComponent,
    DiagramComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MainRoutingModule,
        SharedModule,
        ChartsModule
    ],
  entryComponents: [
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ]
})
export class MainModule {

}
