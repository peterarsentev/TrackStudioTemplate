import { Component, OnInit } from '@angular/core';
import {InterviewTopicService} from '../../../shared/services/interview/interview.topic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {InterviewQuestionService} from '../../../shared/services/interview/interview.question.service';
import {InterviewQuestionModels} from '../../../shared/models/interview/interview.question.model';
import {InterviewTopicModels} from '../../../shared/models/interview/interview.topic.model';
import {NavNode} from '../../../shared/models/nav.node';
import {NavService} from '../../../shared/services/nav.service';
import {InterviewAnswerService} from '../../../shared/services/interview/interview.answer.service';
import {InterviewAnswerModels} from '../../../shared/models/interview/interview.answer.model';
import {RoleService} from '../../../shared/services/role.service';

@Component({
  selector: 'app-interview-question',
  templateUrl: './interview-question.component.html',
  styleUrls: ['./interview-question.component.scss']
})
export class InterviewQuestionComponent implements OnInit {

  topic: InterviewTopicModels;
  question: InterviewQuestionModels;
  answer: InterviewAnswerModels;
  addFormComment = false;
  showEstimate = false;
  loadingAi = false;
  canSolveInterview = false;
  showStories = false;
  stories: InterviewAnswerModels[] = [];
  totalAnswers = 0;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private navService: NavService,
              private interviewAnswerService: InterviewAnswerService,
              private interviewTopicService: InterviewTopicService,
              private roleService: RoleService,
              private interviewQuestionService: InterviewQuestionService) { }

  ngOnInit(): void {
    const topicId = Number(this.activatedRoute.snapshot.paramMap.get('topicId'));
    const questionId = Number(this.activatedRoute.snapshot.paramMap.get('questionId'));
    this.navService.setUpModel({...new NavNode(), interviewTopicId: topicId, interviewQuestionId: questionId, interview: true });
    this.interviewTopicService
      .getById(topicId)
      .subscribe(rs => this.topic = rs);
    this.interviewQuestionService
      .getById(questionId)
      .subscribe(rs => this.question = rs);
    this.roleService.getRulesForCurrentSession()
      .subscribe(rs => this.canSolveInterview = !rs.find(rule => rule.key === 'CAN_SOLVE_INTERVIEW'));
    this.interviewAnswerService.getTotalAnswerByQuestionId(questionId)
      .subscribe(rs => this.totalAnswers = rs.size);
  }

  saveAnswer($event: any) {
    this.addFormComment = false;
    this.showEstimate = true;
    this.loadingAi = true;
    this.interviewAnswerService.saveAnswer(this.question.id, $event)
      .subscribe(rs => {
        this.answer = rs;
        this.loadingAi = false;
      });
  }

  loadStories() {
    this.addFormComment = false;
    this.showEstimate = false;
    this.loadingAi = false;
    this.interviewAnswerService.loadStories(this.question.id)
      .subscribe(rs => {
        this.showStories = true;
        this.stories = rs;
      });
  }

  showAddCommentForm(show: boolean) {
    this.addFormComment = show;
    this.showEstimate = false;
    this.loadingAi = false;
  }

  showAnswer(show: boolean) {
    this.addFormComment = false;
    this.showEstimate = true;
    this.loadingAi = false;
    this.answer = new InterviewAnswerModels(0, 'Без ответа', 0);
  }
}