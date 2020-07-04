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
import { MessagesComponent } from './components/messages/messages.component';
import { TreeModule } from 'angular-tree-component';
import { DiscussionComponent } from './components/discussion/discussion.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { ExamComponent } from './components/exam/exam.component';
import { LeftSideBarComponent } from './components/left-side-bar/left-side-bar.component';
import { TaskNotFoundComponent } from './components/task-not-found/task-not-found.component';
import { TaskAccessComponent } from './components/task-access/task-access.component';
import { ErrorComponent } from './components/error/error.component';
import { TopicsComponent } from './components/task_code/topics/topics.component';
import { TaskCodeListComponent } from './components/task_code/task-code/task-code-list.component';
import { TaskCodeFormComponent } from './components/task_code/task-code-form/task-code-form.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { TaskCodeSolutionComponent } from './components/task_code/task-code-solution/task-code-solution.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';


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
    DiagramComponent,
    MessagesComponent,
    DiscussionComponent,
    SandboxComponent,
    ExamComponent,
    LeftSideBarComponent,
    TaskNotFoundComponent,
    TaskAccessComponent,
    ErrorComponent,
    TopicsComponent,
    TaskCodeListComponent,
    TaskCodeFormComponent,
    TaskCodeSolutionComponent,
    AlertMessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MainRoutingModule,
    SharedModule,
    ChartsModule,
    TreeModule.forRoot(),
    CodemirrorModule
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
