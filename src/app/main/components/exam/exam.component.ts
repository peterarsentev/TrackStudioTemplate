import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { UserModels } from '../../../shared/models/user.models';
import { UserService } from '../../../shared/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ExamModels } from '../../../shared/models/exam.models';
import { ExamsService } from '../../../shared/services/exams.service';
import { ExamUser } from '../../../shared/models/examuser.model';
import { ExamstorageService } from '../../../shared/services/examstorage.service';
import { Question } from '../../../shared/models/question.model';
import { QuestionsService } from '../../../shared/services/questions.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private examsService: ExamsService,
    private questionsService: QuestionsService,
    private storageServiec: ExamstorageService ) {
  }

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  private user: UserModels;
  private exams: ExamModels[];
  private userExams: ExamUser[];
  private moreDetailed: boolean = true;

  private oneExam: ExamModels;
  private questions: Question[];
  private pos: number = 0;

  ngOnInit() {
    this.userService.getModel()
      .pipe(
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => {
      this.user = res;
    });
    this.examsService.getActiveExams().subscribe(exm => this.exams = exm);
  }

  moreDetails(id: number) {
    this.moreDetailed = false;
    this.oneExam = this.exams
      .filter(ex => ex.id === id)
      .shift();
    this.questionsService
      .getByExamId(this.oneExam.id)
      .subscribe(quests => this.questions = quests);
  }
}
