import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExamsService} from '../../../../shared/services/exams.service';
import {QuestionsService} from '../../../../shared/services/questions.service';
import {QoptsService} from '../../../../shared/services/qopts.service';
import {AnswersService} from '../../../../shared/services/answers.service';
import {AoptsService} from '../../../../shared/services/aopts.service';
import {ExamModels} from '../../../../shared/models/exam.models';
import {ExamUser} from '../../../../shared/models/examuser.model';
import {ExamuserService} from '../../../../shared/services/examuser.service';
import {Question} from '../../../../shared/models/question.model';

@Component({
  selector: 'app-exam.result',
  templateUrl: './exam.result.component.html',
  styleUrls: ['./exam.result.component.scss']
})
export class ExamResultComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examsService: ExamsService,
    private examuserService: ExamuserService,
    private questionService: QuestionsService,
    private qoptService: QoptsService,
    private answersService: AnswersService,
    private aoptService: AoptsService
  ) { }

  exam: ExamModels = {};
  examUser: ExamUser;
  examId: number;
  questions: Question[];

  ngOnInit() {
    this.examId = this.route.snapshot.params.examId;
    this.examsService.getExamById(this.examId)
      .subscribe(res => this.exam = res);
    this.examuserService.getByExamId(this.examId)
      .subscribe(res => this.examUser = res);
    this.answersService.getWrongAnswer(this.examId)
      .subscribe(qs => this.questions = qs);
  }

}
