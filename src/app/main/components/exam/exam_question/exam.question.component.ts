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
import {EditorConfiguration} from 'codemirror';

declare var CodeMirror: any;

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
        this.prepareCode();
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

  private prepareCode() {
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach((block) => {
        this.sandBoxWidget(block, false, false, false);
      });
    }, 0);
  }

  private sandBoxWidget(block, java, canRun, golang) {
    // Create elements
    const codeEl = document.createElement('textarea');
    const buttonContainer = document.createElement('div');
    const copyButton = document.createElement('button');
    const div = document.createElement('div');
    const divEnd = document.createElement('div');

    // Add classes and inner text
    div.classList.add('pt-2');
    div.innerText = 'Вывод:';
    divEnd.classList.add('mt-3');
    buttonContainer.classList.add('mt-3', 'mb-1', 'd-flex', 'gap-2');
    copyButton.classList.add('btn', 'btn-light', 'btn-sm');
    copyButton.innerHTML = '<i class="fa fa-copy mr-1"></i>Копировать';
    buttonContainer.appendChild(copyButton);
    block.parentElement.before(buttonContainer);
    block.parentElement.before(codeEl);
    block.parentElement.before(divEnd);

    const code = CodeMirror.fromTextArea(codeEl, {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'text/x-java',
      indentUnit: 4,
      indentWithTabs: false,
      theme: "dracula",
    } as EditorConfiguration);

    code.getDoc().setValue(
      block.innerHTML
        .split('<br>').join('\r\n')
        .split('&gt;').join('>')
        .split('&lt;').join('<')
        .split('&amp;').join('&')
    );

    copyButton.addEventListener('click', () => {
      const codeText = code.getValue();
      navigator.clipboard.writeText(codeText).then(() => {
        const originalIcon = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fa fa-check mr-1"></i>Скопировано';
        setTimeout(() => {
          copyButton.innerHTML = originalIcon;
        }, 2000); // Revert icon back after 2 seconds
      }).catch(err => {
        alert('Failed to copy code: ' + err);
      });
    });

    // Remove the original block element
    block.parentElement.parentElement.removeChild(block.parentElement);
  }
}
