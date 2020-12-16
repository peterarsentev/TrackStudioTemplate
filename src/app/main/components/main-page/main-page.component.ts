import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Router } from '@angular/router';
import { ResponseModel } from '../../../shared/models/response.model';
import { MStatusesModel } from '../../../shared/models/m.statuses.model';
import { forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DiagramaModel } from '../../../shared/models/diagrama.model';
import { VerifiedTasksModel } from '../../../shared/models/verifiedTasksModel';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import * as moment from 'moment';

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
  mstatuses: MStatusesModel[] = [];
  tasks: ResponseModel[];
  provenTasks: TaskTopicModel[] = [];
  newTasks: TaskTopicModel[] = [];

  updateDate: number;
  submitDate: number;
  countOfDays: number;
  speed = 0;

  constructor(private tasksService: TasksService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    // this.getCountAllAndSolvedTasks();
    // this.getTotalAndSolvedTasks();
    this.getProvenTasks();
    this.getNewTasks();
    this.getSolvedAndAllExerciseCount();
  }

  getSolutionId(task: TaskTopicModel) {
    if (!task.solution) {return ''; }
    return ' [#'+ task.solution.id + ']';
  }

  openTask(task: TaskTopicModel) {
    if (!task.solution) {
      this.router.navigate(['exercise', `${task.task.topicId}`, 'task-view', `${task.task.taskId}`]);
    } else {
      this.router
        .navigate(
          ['exercise', `${task.task.topicId}`, 'task-view', `${task.task.taskId}`, 'solutionId', `${task.solution.id}`]);
    }
  }

  // geButtons(taskId: string) {
  //   console.log(taskId)
  //   this.tasksService.getButtons(taskId)
  //     .subscribe(res => this.mstatuses = res.mstatuses)
  // }

  goToNewTask(status: MStatusesModel) {
    this.router.navigate(['/new-task'])
  }
  //
  // getCountAllAndSolvedTasks() {
  //   const defaultProjectId = localStorage.getItem('defaultProjectId');
  //   if (!!defaultProjectId) {
  //     forkJoin([this.tasksService.getTaskCount(defaultProjectId, true, true),
  //       this.tasksService.getTaskCount(defaultProjectId, false, false),
  //       this.tasksService.getTask(defaultProjectId, 'task')
  //     ])
  //       .pipe(takeUntil(this.ngUnsubscribe$))
  //       .subscribe(([all, solved, stat]) => {
  //         this.setResult(all, solved, stat);
  //       });
  //   } else {
  //     this.authService.getDefaultProjectId()
  //       .pipe(
  //         switchMap(() => forkJoin([this.tasksService.getTaskCount(localStorage.getItem('defaultProjectId'), true, true),
  //           this.tasksService.getTaskCount(localStorage.getItem('defaultProjectId'), false, false),
  //           this.tasksService.getTask(localStorage.getItem('defaultProjectId'), 'task')
  //         ]))
  //       ).subscribe(([all, solved, stat]) => {
  //       this.setResult(all, solved, stat);
  //     })
  //   }
  // }

  // private setResult(all: { [p: string]: number }, solved: { [p: string]: number }, stat: ResponseModel) {
  //   this.allTasksCount = all.total;
  //   this.solvedTasksCount = solved.total;
  //   this.barValue = Math.round((this.solvedTasksCount / this.allTasksCount) * 100);
  //   this.submitDate = stat.task.submitdate;
  //   this.updateDate = stat.task.updatedate;
  //   this.countOfDays = Math.round((new Date().getTime() - this.submitDate) / 1000 / 60 / 60 / 24)
  //   this.speed = this.solvedTasksCount / this.countOfDays;
  // }

  // getTotalAndSolvedTasks() {
  //   this.tasksService.getTasks()
  //     .pipe(takeUntil(this.ngUnsubscribe$))
  //     .subscribe(tasks => {
  //       tasks.tasks.forEach(task => task.task.childrenCount > 0 ? this.getProgress(task.task) : null)
  //     })
  // }

  private getProgress(task: TaskModel) {
    forkJoin([this.tasksService.getTaskCount(task.id, true, false),
      this.tasksService.getTaskCount(task.id, false, false)])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([all, solved]) => {
        this.diagrams.push({...new DiagramaModel(), label: task.name, solved: solved.total, total: all.total})
      })
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
        })
  }

  getSpentDays(submitdate: number, updatedate: number) {
    const days =(moment(updatedate).diff(moment(submitdate), 'days'));
    if (days < 1) {
      const time = ((updatedate - submitdate) / 3600000);
      if (time < 0.1) {
        return 'менее часа.';
      }
      return 'часы - ' + time + '.';
    }
    return 'дни - ' + days + '.';
  }
}

