import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InterviewTopicComponent} from './components/interview-topic/interview-topic.component';
import {InterviewTopicsComponent} from './components/interview-topics/interview-topics.component';
import {InterviewQuestionComponent} from './components/interview-question/interview-question.component';


const routes: Routes = [
  { path: '', component: InterviewTopicsComponent },
  { path: ':topicId', component: InterviewTopicComponent, },
  { path: ':topicId/question/:questionId', component: InterviewQuestionComponent, },
  { path: ':topicId/question/:questionId', component: InterviewQuestionComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewRoutingModule { }
