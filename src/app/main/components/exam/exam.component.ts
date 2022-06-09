import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { UserModels } from '../../../shared/models/user.models';
import { UserService } from '../../../shared/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ExamModels } from '../../../shared/models/exam.models';
import { ExamsService } from '../../../shared/services/exams.service';
import { Question } from '../../../shared/models/question.model';
import { QuestionsService } from '../../../shared/services/questions.service';
import { QoptsService } from '../../../shared/services/qopts.service';
import { Qopt } from '../../../shared/models/qopt.model';
import { AoptsService } from '../../../shared/services/aopts.service';
import { Answer } from '../../../shared/models/answer.model';
import { Aopt } from '../../../shared/models/aopt.model';
import { AnswersService } from '../../../shared/services/answers.service';
import { ExamUser } from '../../../shared/models/examuser.model';
import { ExamuserService } from '../../../shared/services/examuser.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExamDetailsModel} from '../../../shared/models/exam.details.model';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private examsService: ExamsService) {
  }

  user: UserModels = {};

  exams: ExamDetailsModel[] = [];

  ngOnInit() {
    this.examsService
      .getActiveExams()
      .subscribe(exm => this.exams = exm);
  }

  examIntro(exam: ExamModels) {
    this.router.navigate(['detail', exam.id], { relativeTo: this.route });
  }
}
