import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '../../../shared/models/response.model';
import { MStatusesModel } from '../../../shared/models/m.statuses.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DiagramaModel } from '../../../shared/models/diagrama.model';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import * as moment from 'moment';
import { LevelModels } from '../../../shared/models/level.models';
import { ChartService } from '../chart/chart.service';
import { UserActivityModel } from '../../../shared/models/user.activity.model';
import { UserService } from '../../../shared/services/user.service';
import { UserModels } from '../../../shared/models/user.models';
import { DiscussService } from '../../discuss/discuss.service';
import { DiscussionMessageModel } from '../../../shared/models/discussionMessageModel';
import { MessageService } from '../../../shared/services/message.service';
import { NavService } from '../../../shared/services/nav.service';

@Component({
  selector: 'app-main',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  diagrams: DiagramaModel[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  allTasksCount = 1;
  solvedTasksCount = 0;
  solvedExerciseCount = 0;
  totalExerciseCount = 0;
  barValue = 0;
  endOfCourse: string;
  mstatuses: MStatusesModel[] = [];
  tasks: ResponseModel[];
  provenTasks: TaskTopicModel[] = [];
  newTasks: TaskTopicModel[] = [];
  doneTasks: TaskTopicModel[] = [];
  login = '';

  updateDate: number;
  submitDate: number;
  countOfDays: number;
  speed = 0;
  tasksBarValue: number;
  solBarValue: number;
  levels: LevelModels[];
  ua: UserActivityModel[];
  uaSolved: UserActivityModel[];
  discussions: DiscussionMessageModel[] = [];
  user: UserModels;
  private userId: number;
  showNews = true;

  constructor(private tasksService: TasksService,
              private authService: AuthService,
              private chartService: ChartService,
              private route: ActivatedRoute,
              private userService: UserService,
              private messageService: MessageService,
              private discussService: DiscussService,
              private navService: NavService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(param => {
        if (this.router.url.includes('user')) {
          const routeParams = this.route.snapshot.paramMap;
          this.userId = Number(routeParams.get('id'));
          this.userService.getById(this.userId)
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe((res: any) => {
              this.login = res.user.name;
              this.navService.setUpModel({name: this.login, url: '/user/' + this.userId, rating: true});
              this.showNews = false;
            });
          this.getCommentsByUserId(this.userId);
        }
        this.getCountAllAndSolvedTasks(this.userId);
        this.getProvenTasks(this.userId);
        this.getSolvedAndAllExerciseCount(this.userId);
        this.getLevels(this.userId);
        this.getSolvedTasks(this.userId);
        this.getUserActivity(this.userId);
        this.getUserSolvedActivity(this.userId);
        this.userService.getModel()
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe(res => this.user = res);
      });
  }

  getCommentsByUserId(userid: number) {
    this.discussService.getCommentsByUserId(userid)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.discussions = res);
  }


  getUserActivity(userid?: number) {
    this.chartService.getUserActivity(userid)
      .subscribe(res => {
        this.ua = res;
      });
  }

  getUserSolvedActivity(userid?: number) {
    this.chartService.getUserSolvedActivity(userid)
      .subscribe(res => {
        this.uaSolved = res;
      });
  }

  getSolvedTasks(userid?: number) {
    this.tasksService.getSolvedTasks(userid)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.doneTasks = res;
      });
  }


  goToNewTask(status: MStatusesModel) {
    this.router.navigate(['/new-task']);
  }

  getCountAllAndSolvedTasks(id?: number) {
    this.tasksService.getCountTasks(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.allTasksCount = res.all;
        this.solvedTasksCount = res.solved;
        this.tasksBarValue = +((this.solvedTasksCount / this.allTasksCount) * 100).toFixed(2);
        this.submitDate = res.submitDate === 0 ? new Date().getTime() : res.submitDate;
        this.updateDate = res.updateDate === 0 ? new Date().getTime() : res.updateDate;
        this.countOfDays = Math.round((new Date().getTime() - this.submitDate) / 1000 / 60 / 60 / 24);
        this.speed = this.solvedTasksCount / this.countOfDays;
        const days = Math.round((this.allTasksCount - this.solvedTasksCount) / this.speed);
        this.endOfCourse = moment().add(days, 'days').format('DD.MM.YYYY HH:mm');
      });
  }

  getProvenTasks(userId?: number) {
    this.tasksService
      .getVerifiedTasks(userId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.provenTasks = res;
      });
  }

  getNewTasks(userId?: number) {
    this.tasksService.getNewTasks(userId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.newTasks = res;
      });
  }

  private getSolvedAndAllExerciseCount(userId?: number) {
    this.tasksService.getSolvedAndAllExerciseCount(userId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.solvedExerciseCount = res.solved;
        this.totalExerciseCount = res.all;
        this.solBarValue = +((this.solvedExerciseCount / this.totalExerciseCount) * 100).toFixed(2);
      });
  }

  getSpentDays(submitdate: number, updatedate: number) {
    const days = (moment(updatedate).diff(moment(submitdate), 'days'));
    if (days < 1) {
      const time = ((updatedate - submitdate) / 3600000);
      if (time < 0.1) {
        return 'менее часа.';
      }
      return 'часы - ' + time + '.';
    }
    return 'дни - ' + days + '.';
  }

  private getLevels(userId?: number) {
    this.tasksService.getLevels(userId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        res.forEach(level => this.tasksService.getCountTasksByLevel(level.id).subscribe(counts => {
          level.all = counts.all;
          level.solved = counts.solved;
          level.progress = +((level.solved / level.all) * 100).toFixed(2);
        }));
        this.levels = res;
      });
  }
  updateDiscussion(discussion: DiscussionMessageModel) {
    this.messageService.updateDiscussion(discussion)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {});
  }

}

