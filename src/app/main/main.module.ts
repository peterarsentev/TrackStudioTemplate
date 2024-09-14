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
import { FooterComponent } from './components/footer/footer.component';
import { ProgressBarTasksComponent } from './components/progress-bar/progres-bar-tasks/progress-bar-tasks.component';
import { MessageComponent } from './components/message/message.component';
import { GetDatePipe } from '../shared/get-date.pipe';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { ChartsModule } from 'ng2-charts';
import { DiagramComponent } from './components/diagramma/diagram.component';
import { MessagesComponent } from './components/messages/messages.component';
import { TreeModule } from 'angular-tree-component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { ExamComponent } from './components/exam/exam.component';
import { LeftSideBarComponent } from './components/left-side-bar/left-side-bar.component';
import { TaskNotFoundComponent } from './components/task-not-found/task-not-found.component';
import { TaskAccessComponent } from './components/task-access/task-access.component';
import { ErrorComponent } from './components/error/error.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { RegistrationComponent } from './components/registration/registration.component';
import { AdminMessageComponent } from './components/header/admin-message/admin-message.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ChartModule } from 'angular2-chartjs';
import { ChartUserComponent } from './components/chart/chart-user.component';
import { ExamIntroComponent } from './components/exam/exam_intro/exam.intro.component';
import { ExamQuestionComponent } from './components/exam/exam_question/exam.question.component';
import { ExamResultComponent } from './components/exam/exam_result/exam.result.component';
import { InfoComponent } from './components/info/info.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LeadersComponent } from './components/exam/exam_intro/leaders/leaders.component';
import { AssistantComponent } from '../../assistant/assistant/assistant.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    LoginComponent,
    MainPageComponent,
    TaskComponent,
    TasksComponent,
    // NavigationComponent,
    FooterComponent,
    ProgressBarTasksComponent,
    MessageComponent,
    GetDatePipe,
    NewTaskComponent,
    DiagramComponent,
    MessagesComponent,
    InfoComponent,
    SandboxComponent,
    ExamComponent,
    LeftSideBarComponent,
    TaskNotFoundComponent,
    TaskAccessComponent,
    ErrorComponent,
    RegistrationComponent,
    AdminMessageComponent,
    PaymentComponent,
    ChartUserComponent,
    ExamIntroComponent,
    ExamQuestionComponent,
    ExamResultComponent,
    LeadersComponent,
    AssistantComponent
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
    CodemirrorModule,
    ChartModule,
    InfiniteScrollModule
  ],
  entryComponents: [],
  exports: [],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ]
})
export class MainModule {

}
