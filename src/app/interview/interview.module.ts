import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewRoutingModule } from './interview-routing.module';
import { InterviewTopicsComponent } from './components/interview-topics/interview-topics.component';
import { InterviewTopicComponent } from './components/interview-topic/interview-topic.component';
import { InterviewQuestionComponent } from './components/interview-question/interview-question.component';
import { InterviewRandomQuestionComponent } from './components/interview-random-question/interview-random-question.component';
import { InterviewByStatusComponent } from './components/interview-by-status/interview-by-status.component';

import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    InterviewTopicsComponent,
    InterviewTopicComponent,
    InterviewQuestionComponent,
    InterviewRandomQuestionComponent,
    InterviewByStatusComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InterviewRoutingModule
  ]
})
export class InterviewModule { }
