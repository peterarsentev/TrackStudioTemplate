import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SqlSolutionService} from '../../../shared/services/sql-solution.service';
import {SqlExercise, SqlResult} from '../../../shared/models/sql-exercise.model';
import {AlertService} from '../../../shared/services/alertService';
import {TypeAlertsModel} from '../../../shared/models/type.alerts.model';
import {PrevNextService} from '../../service/prev-next.service';
import { NavService } from 'src/app/shared/services/nav.service';
import { NavNode } from 'src/app/shared/models/nav.node';
import {UserModels} from '../../../shared/models/user.models';
import {MessageService} from '../../../shared/services/message.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {UserService} from '../../../shared/services/user.service';
import {DiscussionMessageModel} from '../../../shared/models/discussionMessageModel';

@Component({
  selector: 'app-sql-exercise',
  templateUrl: './sql-exercise.component.html'
})
export class SqlExerciseComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  exercise: SqlExercise = new SqlExercise(
    -1, '', '', -1, '', '', '', -1, ''
  );
  load = false;
  solution: any;

  optionsOutput = {
    lineNumbers: true,
    readOnly: true,
    mode: 'text/x-pgsql'
  };

  solutionOptions = {
    lineNumbers: true,
    readOnly: false,
    mode: 'text/x-pgsql'
  };

  solutionSql = '';
  solutionResult = new SqlResult(false, '');

  prevId: number | null = null;
  nextId: number | null = null;

  discussions: DiscussionMessageModel[] = [];
  user: UserModels;

  checked = true;

  constructor(private activatedRoute: ActivatedRoute,
              private sqlExerciseService: SqlSolutionService,
              private prevNextService: PrevNextService,
              private navService: NavService,
              private messageService: MessageService,
              private userService: UserService,
              private router: Router,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.alertService.setUpMessage('', null);
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getModel()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => this.user = res);
      this.sqlExerciseService.getById(+params.id).subscribe((result) => {
        this.sqlExerciseService.getSolution(result.id).subscribe(s => {
          this.exercise = result;
          this.solutionSql = s.solution;
          this.exercise.status = s.status;
          this.load = true;
          this.updateImages();
          this.updatePrevNextIds();
          this.navService.setUpModel(
            {... new NavNode(), sqlExercise: true,
              topicId: this.exercise.topicId, taskId: this.exercise.id}
          );
          this.getDiscussions();
        });
      });
    });
  }

  sendSolution() {
    const statusBefore = this.exercise.status;
    this.exercise.status = statusBefore === 'NEW' ? 'PROGRESS' : statusBefore;
    this.checked = false;
    return this.sqlExerciseService.check(this.exercise.id, this.solutionSql).subscribe((result) => {
      this.solutionResult = result;
      this.checked = true;
      this.alertService.setUpMessage(undefined);
      if (result.equal) {
        this.alertService.setUpMessage('Поздравляем! Задача решена верно!', TypeAlertsModel.SUCCESS);
      } else {
        this.alertService.setUpMessage(`Задача решена не верно (${result.message}), попробуйте еще раз`, TypeAlertsModel.DANGER);
      }
    });
  }

  wipeSolution() {
    this.sqlExerciseService.wipeSolution(this.exercise.id).subscribe((result) => {
      this.solutionSql = '';
      this.exercise.status = 'NEW';
      this.alertService.setUpMessage('', null);
      this.checked = true;
    });
  }

  private updateImages() {
    setTimeout(() => {
      document.querySelectorAll('a img').forEach((block) => {
        block.parentElement.setAttribute('data-lightbox', 'images');
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.alertService.setUpMessage('', null);
  }

  goTo(id: number) {
    this.alertService.setUpMessage('', null);
    this.router.navigate(['sqlExercise', this.exercise.topicId, 'show', id]);
  }

  private updatePrevNextIds() {
    let prevNextIds = this.prevNextService.getPrevNextIds(this.exercise.id);
    if (prevNextIds.nextId === null && prevNextIds.prevId === null) {
      this.sqlExerciseService.all(this.exercise.topicId).subscribe(exs => {
        this.prevNextService.setUpData(exs);
        prevNextIds = this.prevNextService.getPrevNextIds(this.exercise.id);
        this.prevId = prevNextIds.prevId;
        this.nextId = prevNextIds.nextId;
      });
    } else {
      this.prevId = prevNextIds.prevId;
      this.nextId = prevNextIds.nextId;
    }
  }

  closeDiscussion(text: string) {
    if (!!text) {
      this.submitComment(text);
    }
  }

  submitComment(text: string) {
    this.messageService.addDiscussion(undefined, text, -1, undefined, this.exercise.id)
      .subscribe(res => {
        this.getDiscussions();
      }, error => {
        if (error.status === 403) {
          alert('У вас нет прав на эту операцию!');
        }
      });
  }

  private getDiscussions() {
    this.messageService.getDiscussions(undefined, undefined, this.exercise.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.discussions = res);
  }

  updateDiscussion(discussion: DiscussionMessageModel) {
    this.messageService.updateDiscussion(discussion)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.getDiscussions());
  }

  addResponse(data: DiscussionMessageModel) {
    if (!!data.text) {
      this.messageService.addDiscussion(undefined, data.text, -1, undefined, this.exercise.id, data.parentId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.getDiscussions();
        });
    }
  }
}
