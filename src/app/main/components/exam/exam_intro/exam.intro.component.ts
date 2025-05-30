import { Component, OnInit } from '@angular/core';
import {QuestionsService} from '../../../../shared/services/questions.service';
import {ExamModels} from '../../../../shared/models/exam.models';
import {ActivatedRoute, Router} from '@angular/router';
import {ExamsService} from '../../../../shared/services/exams.service';
import {QoptsService} from '../../../../shared/services/qopts.service';
import {Qopt} from '../../../../shared/models/qopt.model';
import { NavService } from '../../../../shared/services/nav.service';
import {UserModels} from '../../../../shared/models/user.models';
import {UserService} from '../../../../shared/services/user.service';

@Component({
  selector: 'app-exam.intro',
  templateUrl: './exam.intro.component.html',
  styleUrls: ['./exam.intro.component.scss']
})
export class ExamIntroComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examsService: ExamsService,
    private qoptService: QoptsService,
    public navService: NavService,
    private userService: UserService,
  ) { }

  exam: ExamModels = {};
  examId: number;
  qopts: Qopt[];
  user: UserModels;

  ngOnInit() {
    this.examId = this.route.snapshot.params.examId;
    this.examsService.getExamById(this.examId)
      .subscribe(res => {
        this.exam = res;
        console.log(this.exam.name);
        this.navService.setUpModel({exams: true, name: this.exam.name})
      });
    this.userService.getModel()
      .subscribe(user => this.user = user)
  }

  startExam(exam: ExamModels) {
    if (!!this.user && this.user.login !== 'guest') {
      this.router.navigate(['question', ''], {relativeTo: this.route});
    } else {
      this.router.navigate(['login']);
    }
  }

}
