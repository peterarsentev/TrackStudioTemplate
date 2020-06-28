import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {UserModels} from '../../../shared/models/user.models';
import {UserService} from '../../../shared/services/user.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ExamModels} from '../../../shared/models/exam.models';
import {ExamsService} from '../../../shared/services/exams.service';
import {Question} from '../../../shared/models/question.model';
import {QuestionsService} from '../../../shared/services/questions.service';
import {QoptsService} from "../../../shared/services/qopts.service";
import {Qopt} from "../../../shared/models/qopt.model";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {AoptsService} from "../../../shared/services/aopts.service";
import {Answer} from "../../../shared/models/answer.model";
import {Aopt} from "../../../shared/models/aopt.model";
import {AnswersService} from "../../../shared/services/answers.service";
import {ExamUser} from "../../../shared/models/examuser.model";
import {UserforexamService} from "../../../shared/services/userforexam.service";
import {Userforexam} from "../../../shared/models/userforexam.model";
import {ExamuserService} from "../../../shared/services/examuser.service";

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private userListService: UserforexamService,
    private examsService: ExamsService,
    private examuserService: ExamuserService,
    private questionsService: QuestionsService,
    private answersService: AnswersService,
    private qoptsService: QoptsService,
    private aoptsService: AoptsService) {
  }

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels = {};

  startTest: boolean = false;
  exams: ExamModels[] = [];
  examUsers: ExamUser[] = [];

  currentUser: Userforexam = {};
  currentExamUser: ExamUser = new ExamUser();
  currentExam: ExamModels = {};
  currentQuestion: Question = {};
  currentQopts: Qopt[] = [];
  currentAnswer: Answer = {};


  questions: Question[] = [];
  qopts: Qopt[] = [];

  answers: Answer[] = [];
  aopts: Aopt[] = [];

  pos: number = 0;

  ngOnInit() {
    this.loadInfo();
  }

  loadInfo() {
    this.userService.getModel()
      .pipe(
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => {
      this.user = res;
      this.userListService.getByLogin(res.login).subscribe((userlist) => {
        this.examuserService.getUserExamsById(userlist.id).subscribe((data) => {
          this.examUsers = data;
        });
      });
    });
    this.examsService
      .getActiveExams()
      .subscribe(exm => this.exams = exm);
  }

  getTimes(id): string {
    if (this.examUsers && this.examUsers.length > 0) {
      return String(this.examUsers.filter((x) => x.exam.id === id).length);
    }
    return '';
  }

  getResult(id): string {
    if (this.examUsers && this.examUsers.length > 0) {
      return String(this.examUsers
        .filter((x) => x.exam.id === id)
        .sort((x, y) =>
          y.result - x.result
        ).shift().result);
    }
    return '';
  }

  getLastTime(id): string {
    if (this.examUsers && this.examUsers.length > 0) {
      const date = new Date(this.examUsers
        .filter((x) => x.exam.id === id)
        .sort((x, y) =>
          x.finish - y.finish
        ).shift().finish);
      return date.getFullYear() + '.' + date.getMonth() + '.' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes();
    }
    return '';
  }

  startExam(exam: ExamModels) {
    if (this.user != undefined && this.user.login) {
      this.currentExam = exam;
      this.userListService.getByLogin(this.user.login).subscribe((data) => {
        if (data == null) {
          this.currentUser = new Userforexam(0, this.user.login);
          this.userListService.saveOrUpdateQuestion(this.currentUser).subscribe(answer => this.currentUser = answer);
        } else {
          this.currentUser = data;
        }
        this.currentExamUser.userid = this.currentUser.id;
      });
      this.currentExamUser.exam = this.currentExam;
      this.currentExamUser.start = Date.now();
      this.loadQuestion();
      this.startTest = true;
    }
  }

  brokeExam() {
    this.currentExam = {};
    this.startTest = false;
  }

  loadQuestion() {
    this.questionsService
      .getByExamId(this.currentExam.id)
      .subscribe((data) => {
          this.questions = data;
          this.currentQuestion = this.questions[this.pos];
        },
        () => {
        },
        () => {
          this.loadQopts();
          this.prepareAnswers();
        });
  }

  loadQopts() {
    if (this.qopts.filter((x) => {
      return x.question.id == this.currentQuestion.id
        && x.question.name == this.currentQuestion.name;
    }).length == 0) {
      this.qoptsService
        .getByQuestId(String(this.currentQuestion.id))
        .subscribe((data) => {
          this.currentQopts = data.sort((x, y) => {
            return x.pos - y.pos;
          });
          data.forEach((x) => this.qopts.push(x));
        });
    } else {
      this.currentQopts = this.qopts
        .filter((x) => x.question.id == this.currentQuestion.id)
        .sort((x, y) => {
          return x.pos - y.pos;
        });
    }
  }

  prepareAnswers() {
    this.questions.forEach((x) => {
      this.answers.push(new Answer(0, x, this.currentExamUser));
    });
    this.chooseCurrentAnswer();
  }

  chooseCurrentAnswer() {
    this.currentAnswer = this.answers
      .filter((x) => x.question.id == this.currentQuestion.id).shift();
  }

  choose(qp: Qopt, targer) {
    if (targer.checked) {
      this.aopts.push(new Aopt(0, this.currentAnswer, qp));
    } else {
      this.aopts = this.aopts.filter((x) => x.opt.id != qp.id);
    }
  }

  checked(qp: Qopt): boolean {
    return this.aopts.filter((x) => x.opt.id == qp.id).length > 0;
  }

  hasNext(): boolean {
    return this.pos < (this.questions.length - 1);
  }

  hasBack(): boolean {
    return this.pos > 0;
  }

  next() {
    if (this.hasNext()) {
      this.pos++;
      this.currentQuestion = this.questions[this.pos];
      this.loadQopts();
      this.chooseCurrentAnswer();
    }
  }

  back() {
    if (this.hasBack()) {
      this.pos--;
      this.currentQuestion = this.questions[this.pos];
      this.loadQopts();
      this.chooseCurrentAnswer();
    }
  }

  result(): number {
    return this.aopts.filter((x) => x.opt.correct).length;
  }

  total(): number {
    return this.qopts.filter((x) => x.correct).length;
  }

  finish() {
    this.currentExamUser.id = 0;
    this.currentExamUser.finish = Date.now();
    this.currentExamUser.result = this.result();
    this.currentExamUser.total = this.total();
    this.examuserService.saveOrUpdateQuestion(this.currentExamUser).subscribe((data) => {
      this.currentExamUser = data;
    }, () => {
    }, () => {
      this.answers.forEach((answ) => {
        answ.examuser = this.currentExamUser;
        this.answersService.saveOrUpdateQuestion(answ).subscribe((saved) => {
          answ.id = saved.id;
        }, () => {
        }, () => {
          let aopt: Aopt[] = [];
          aopt = this.aopts.filter((x) => x.answer.question.id == answ.question.id);
          aopt.map((x) => x.answer = answ);
          aopt.forEach((ap) => this.aoptsService.saveOrUpdateQuestion(ap).subscribe());
        });
      });
    });
    this.loadInfo();
    this.startTest = false;
  }

}
