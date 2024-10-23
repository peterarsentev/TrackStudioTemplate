import { Component, OnInit } from '@angular/core';
import {InterviewTopicService} from '../../../shared/services/interview/interview.topic.service';
import {Router} from '@angular/router';
import {InterviewTopicModels} from '../../../shared/models/interview/interview.topic.model';
import {NavNode} from '../../../shared/models/nav.node';
import {NavService} from '../../../shared/services/nav.service';

@Component({
  selector: 'app-interview-topics',
  templateUrl: './interview-topics.component.html',
  styleUrls: ['./interview-topics.component.scss']
})
export class InterviewTopicsComponent implements OnInit {

  topics: InterviewTopicModels[] = [];
  views: Map<number, number>;

  constructor(private router: Router,
              private navService: NavService,
              private interviewTopicService: InterviewTopicService) { }

  ngOnInit(): void {
    this.navService.setUpModel({...new NavNode(), interview: true });
    this.interviewTopicService
      .getAllInterviewTopics()
      .subscribe(rs => this.topics = rs);

    this.interviewTopicService
      .getViewsForAllTopics()
      .subscribe(rs => this.views = rs);
  }

  linkTopic(topicId: number) {
    this.router.navigate(['interview', topicId]);
  }

}
