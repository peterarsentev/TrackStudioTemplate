import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { TasksService } from '../../../shared/services/tasks.service';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-main',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  diagrams: DiagramaModel[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  allTasksCount  = 1;
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

  updateDate: number;
  submitDate: number;
  countOfDays: number;
  speed = 0;
  tasksBarValue: number;
  solBarValue: number;
  levels: LevelModels[];
  ua: UserActivityModel[];
  uaSolved: UserActivityModel[];

  constructor(private tasksService: TasksService,
              private authService: AuthService,
              private chartService: ChartService,
              private router: Router) { }

  ngOnInit() {
    this.getCountAllAndSolvedTasks();
    // this.getTotalAndSolvedTasks();
    this.getProvenTasks();
    this.getNewTasks();
    this.getSolvedAndAllExerciseCount();
    this.getLevels();
    this.getSolvedTasks();
    this.getUserActivity();
    this.getUserSolvedActivity();
  }

  getUserActivity() {
    this.chartService.getUserActivity()
      .subscribe(res => {
        this.ua = res;
      });
  }
  getUserSolvedActivity() {
    this.chartService.getUserSolvedActivity()
      .subscribe(res => {
        this.uaSolved = res;
      });
  }

  getSolvedTasks() {
    this.tasksService
      .getSolvedTasks()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.doneTasks = res;
      });
  }


  goToNewTask(status: MStatusesModel) {
    this.router.navigate(['/new-task']);
  }

  getCountAllAndSolvedTasks() {
    this.tasksService.getCountTasks()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.allTasksCount = res.all;
        this.solvedTasksCount = res.solved;
        this.tasksBarValue = Math.round((this.solvedTasksCount / this.allTasksCount) * 100);
        this.submitDate = res.submitDate === 0 ? new Date().getTime() : res.submitDate;
        this.updateDate = res.updateDate === 0 ? new Date().getTime() : res.updateDate;
        this.countOfDays = Math.round((new Date().getTime() - this.submitDate) / 1000 / 60 / 60 / 24);
        this.speed = this.solvedTasksCount / this.countOfDays;
        const days = Math.round((this.allTasksCount - this.solvedTasksCount) / this.speed);
        this.endOfCourse = moment().add(days, 'days').format('DD.MM.YYYY HH:mm');
      });
  }

  getProvenTasks() {
    this.tasksService
      .getVerifiedTasks()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.provenTasks = res;
      });
  }

  getNewTasks() {
    this.tasksService
      .getNewTasks()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.newTasks = res;
      });
  }

  private getSolvedAndAllExerciseCount() {
    this.tasksService.getSolvedAndAllExerciseCount()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.solvedExerciseCount = res.solved;
          this.totalExerciseCount = res.all;
          this.solBarValue = Math.round((this.solvedExerciseCount / this.totalExerciseCount) * 100);
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

  private getLevels() {
    this.tasksService.getLevels()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        res.forEach(level => this.tasksService.getCountTasksByLevel(level.id).subscribe(counts => {
          level.all = counts.all;
          level.solved = counts.solved;
          level.progress = Math.round((level.solved / level.all) * 100);
        }));
        this.levels = res;
      });
  }


}

