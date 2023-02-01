import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ExamsService } from '../../../../shared/services/exams.service';
import { ExamModels } from '../../../../shared/models/exam.models';
import { NavQuestionModel } from '../../../../shared/models/nav.question.models';
import { QoptsService } from '../../../../shared/services/qopts.service';
import { Qopt } from '../../../../shared/models/qopt.model';
import { QuestionsService } from '../../../../shared/services/questions.service';
import { Aopt } from '../../../../shared/models/aopt.model';
import { AnswersService } from '../../../../shared/services/answers.service';
import { AoptsService } from '../../../../shared/services/aopts.service';
import { ProgressModel } from '../../../../shared/models/progress.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-exam.question',
  templateUrl: './exam.question.component.html',
  styleUrls: ['./exam.question.component.scss']
})
export class ExamQuestionComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examsService: ExamsService,
    private questionService: QuestionsService,
    private qoptService: QoptsService,
    private answersService: AnswersService,
    private aoptService: AoptsService
  ) { }

  exam: ExamModels = {};
  examId: number;
  navQuestion: NavQuestionModel;
  qopts: Qopt[];
  previousBtn = false;
  nextBtn = false;
  aopts: Aopt[] = [];
  progress: ProgressModel;
  unsubscribe$: Subject<void> = new Subject();

  ngOnInit() {
    this.examId = this.route.snapshot.params.examId;
    this.examsService.startExam(this.examId)
      .subscribe(res => {
        this.navQuestion = res;
        this.loadQuestionWithAnswer(res.current);
      });
    this.examsService.getExamById(this.examId)
      .subscribe(res => this.exam = res);
    this.getProgress();
    this.router.events
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        if (res instanceof NavigationEnd) {
          this.getProgress();
        }
      });
  }

  getProgress() {
    this.examsService.progress(this.examId)
      .subscribe(res => {
        this.progress = res;
      });
  }

  loadQuestionWithAnswer(question) {
    this.qoptService.getByQuestId(question.id)
      .subscribe(q => {
        this.qopts = q;
        this.aoptService.getByExamIdQuestionId(this.examId, question.id)
          .subscribe(aopts => {
            this.aopts = aopts;
            this.previousBtn = this.navQuestion.previous !== undefined;
            this.nextBtn = this.navQuestion.next !== undefined;
            this.qopts.forEach(qo => {
              this.aopts.forEach(ao => {
                if (ao.qoptId === qo.id) {
                  qo.checked = true;
                }
              });
            });
          });
      });
  }

  next(nextQuestion) {
    this.answersService.save(this.navQuestion.current.id, this.examId, this.aopts)
      .subscribe(res => {
        this.questionService.next(this.examId, nextQuestion.id).subscribe(nRes =>  {
          this.navQuestion = nRes;
          this.previousBtn = this.navQuestion.previous !== undefined;
          this.nextBtn = this.navQuestion.next !== undefined;
        });
        this.loadQuestionWithAnswer(nextQuestion);
        this.getProgress();
      });
  }

  calcResult() {
    this.answersService.save(this.navQuestion.current.id, this.examId, this.aopts)
      .subscribe(res => {
        this.router.navigate(['exams', 'result', this.examId]);
      });
  }

  previous(previousQuestion) {
    this.questionService.next(this.examId, previousQuestion.id).subscribe(nRes =>  {
      this.navQuestion = nRes;
      this.previousBtn = this.navQuestion.previous !== undefined;
      this.nextBtn = this.navQuestion.next !== undefined;
      this.loadQuestionWithAnswer(previousQuestion);
    });
  }

  choose(questionId, qp: Qopt, targer) {
    if (targer.checked) {
      this.aopts.push(new Aopt(0, qp.id));
    } else {
      this.aopts = this.aopts.filter((x) => x.qoptId !== qp.id);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
