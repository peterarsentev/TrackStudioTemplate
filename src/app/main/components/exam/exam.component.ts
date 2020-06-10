import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { UserModels } from '../../../shared/models/user.models';
import { UserService } from '../../../shared/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ExamModels } from '../../../shared/models/exam.models';
import { ExamsService } from '../../../shared/services/exams.service';
import { ExamUser } from '../../../shared/models/examuser.model';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private examsService: ExamsService) {
  }

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  exams: ExamModels[];
  userExams: ExamUser[];
  moreDetailed: boolean = true;
  oneExam: ExamModels;

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
    this.oneExam = this.exams[id];
  }
}
