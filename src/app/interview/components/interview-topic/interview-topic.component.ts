import { Component, OnInit } from '@angular/core';
import {InterviewQuestionService} from '../../../shared/services/interview/interview.question.service';
import {InterviewTopicService} from '../../../shared/services/interview/interview.topic.service';
import {ActivatedRoute, Router} from '@angular/router';
import {InterviewQuestionModels} from '../../../shared/models/interview/interview.question.model';
import {InterviewTopicModels} from '../../../shared/models/interview/interview.topic.model';
import {NavService} from '../../../shared/services/nav.service';
import {NavNode} from '../../../shared/models/nav.node';

@Component({
  selector: 'app-interview-topic',
  templateUrl: './interview-topic.component.html',
  styleUrls: ['./interview-topic.component.scss']
})
export class InterviewTopicComponent implements OnInit {

  topic: InterviewTopicModels;
  questions: InterviewQuestionModels[] = [];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private navService: NavService,
              private interviewTopicService: InterviewTopicService,
              private interviewQuestionService: InterviewQuestionService) { }

  ngOnInit(): void {
    const topicId = Number(this.activatedRoute.snapshot.paramMap.get('topicId'));
    this.navService.setUpModel({...new NavNode(), interviewTopicId: topicId, interview: true });
    this.interviewTopicService
      .getById(topicId)
      .subscribe(rs => this.topic = rs);
    this.interviewQuestionService
      .findByTopicId(topicId)
      .subscribe(rs => this.questions = rs);
  }

  linkQuestion(topicId: number, questionId: number) {
    this.router.navigate(['interview', topicId, 'question', questionId]);
  }

}
