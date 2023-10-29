import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { TaskModel } from '../../../shared/models/task.model';
import { EmergencyModel } from '../../../shared/models/emergency.model';
import { NavNode } from '../../../shared/models/nav.node';
import { NavService } from '../../../shared/services/nav.service';
import {SqlSolutionService} from '../../../shared/services/sql-solution.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  tasks: TaskModel[];
  emergency: EmergencyModel[] = [];
  show = true;
  solution = false;
  solutions: NavNode[] = [{...new NavNode(), name: 'Job4j', url: '/'}];
  private taskCodeId: string;
  private topicId: string;
  @Output()getMessage = new EventEmitter();

  status = {
    review: 'На проверке',
    revert: 'Отклоненные',
    finished: 'Выполненные'
  };

  constructor(private route: ActivatedRoute,
              private navService: NavService,
              private router: Router,
              private taskService: TasksService,
              private tasksService: TasksService, private sqlExerciseService: SqlSolutionService) { }

  ngOnInit() {
    this.navService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$), debounceTime(10))
      .subscribe(res => {
        this.getMessage.emit();
        if (res) {
          this.topicId = res.topicId ? '' + res.topicId : undefined;
          this.taskCodeId = res.taskId ? '' + res.taskId : undefined;
          if (this.router.url !== '/login') {
            if (res.updates) {
              this.getNavsForUpdates(res);
              return;
            }
            if (res.exercise) {
              this.getNavsForTasks(res);
              return;
            }
            if (res.exams) {
              this.getNavsForExams(res);
              return;
            }
            if (res.task_code) {
              this.getNavsForSolutions(res);
              return;
            }
            if (res.discuss) {
              this.getNavsForDiscuss();
              return;
            }
            if (res.vacancy) {
              this.getVacancy(res);
              return;
            }
            if (res.company) {
              this.getCompany(res);
              return;
            }
            if (res.solutions) {
              this.getSolutions(res);
              return;
            }
            if (res.interview) {
              this.interviews(res);
              return;
            }
            if (res.rating) {
              this.rating(res);
              return;
            }
            if (res.payment) {
              this.solutions = [{ name: 'Job4j', url: '/'},
                { name: 'Оплата', url: '/payment'}];
              return;
            }
            this.solutions = [{...new NavNode(), name: 'Job4j', url: '/'}];
            if (res.sqlExercise) {
              this.getNavsForSqlExercise();
            }
            if (!res.task_code && !res.exercise  && !res.sqlExercise) {
              this.solutions = [{...new NavNode(), name: 'Job4j', url: '/'}];
            }
          }
        }
      });
  }

  getNavsForDiscuss() {
    this.tasksService.getNavsForDiscuss(this.taskCodeId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.solutions = res);

  }

  getNavsForSolutions(nav: NavNode) {
    this.tasksService.getNavsForSolutions(this.topicId, this.taskCodeId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        if (this.router.url.endsWith('solutions')) {
          res = [...res, {...new NavNode(), name: 'Решения', url: 'task_code_solutions'}];
        }
        if (!!nav.solutionId) {
          res.find(r => r.url === 'task_code').solutionId = nav.solutionId;
        }
        if (!!nav.userId) {
          res = [...res, {...new NavNode(), name: 'Решения', topicId: nav.topicId, taskCodeId: nav.taskCodeId, solutionId: nav.solutionId,
            url: 'task_code_solutions'}];
          res = [...res, {...new NavNode(), name: nav.name, url: nav.userId}];
        }
        this.solutions = res;
      });
  }

  getNavsForTasks(navs: NavNode) {
    this.tasksService.getNavsForTasks(this.topicId, this.taskCodeId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        if (!!navs.authorName) {
          res = [...res, {...new NavNode(), name: 'Решения', url: 'solutions', taskId: navs.taskId, topicId: navs.topicId},
            {...new NavNode(),  taskId: navs.taskId, topicId: navs.topicId, name: navs.authorName}];
        }
        if (this.router.url.endsWith('solutions')) {
          res = [...res, {...new NavNode(), name: 'Решения', url: 'solutions'}];
        }
        this.solutions = res;
      });
  }

  private getNavsForSqlExercise() {
    this.sqlExerciseService.getNavsForExercises(this.topicId, this.taskCodeId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.solutions = res;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  private checkRout() {
    this.checkUrl(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url: string = event.url;
        this.checkUrl(url);
      });
  }

  checkUrl(url: string) {
    this.solution = false;
    this.show = url !== '/login';
    this.show = this.show && !url.startsWith('/topic');
    this.show = this.show && !url.startsWith('/task_code');
    this.isSolutions(url);
  }

  private isSolutions(url: string) {
    if (!this.show && url !== '/login') {
      this.tasksService.getNavsForSolutions(this.topicId, this.taskCodeId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => this.solutions = res);
      this.solution = true;
    }
  }

  goToSol(nav: NavNode, idx: number) {
    if (idx < this.solutions.length - 1) {
      if (nav.url === '/') {
        this.navService.setUpModel({...new NavNode()});
      }
      if (nav.url === 'solutions') {
        this.router.navigate(['exercise', `${nav.topicId}`, 'task-view', `${nav.taskId}`, 'solutions']);
        return;
      }
      if (nav.url === 'task-view') {
        this.router.navigate(['exercise', `${nav.topicId}`, `${nav.url}`, `${nav.taskId}`]);
        return;
      }
      if (nav.url === 'task_code') {
        this.router.navigate(['topics', `${nav.topicId}`, 'task_code', `${nav.taskCodeId}`, `${nav.solutionId}`]);
        return;
      }
      if (nav.url === 'task_code_solutions') {
        this.router.navigate(['topics', `${nav.topicId}`, 'task_code', `${nav.taskCodeId}`, `${nav.solutionId}`, 'solutions']);
        return;
      }
      if (!!nav.topicId) {
        this.router.navigate([`${nav.url}`, `${nav.topicId}`]);
      } else {
        console.log(nav);
        if (nav.url === 'exercise') {
          if (nav.levelId) {
            this.taskService.setNewFilters(nav.levelId, nav.categoryId)
              .subscribe(() => this.router.navigate([`${nav.url}`]).then(() => {}));
            return;
          }
        }
        this.router.navigate([`${nav.url}`]);
      }
      return;
    }
  }

  /*
    this.saveFilter(FilterTopicEnum.CATEGORY, category.id);
    this.saveFilter(FilterTopicEnum.LEVEL, level.id);

      this.taskService.saveFilter(key, value)
      .subscribe((res: TopicFilter) => {
        this.getUserFilters();
        this.getTasksTopicsList();
      });
   */

  private getVacancy(res: NavNode) {
    const navs = [{name: 'Job4j', url: '/', vacancy: true},
      { name: 'Вакансии', url: '/vacancies', vacancy: true}];
    if (res.name) {
      this.solutions = [...navs, res];
    } else {
      this.solutions = navs;
    }
  }

  private getCompany(res: NavNode) {
    const navs = [{name: 'Job4j', url: '/', company: true},
      { name: 'Компании', url: '/company', company: true}];
    if (res.name) {
      this.solutions = [...navs, res];
    } else {
      this.solutions = navs;
    }
  }

  private getSolutions(res: NavNode) {
    const navs = [{name: 'Job4j', url: '/', solutions: true},
      { name: 'Решения', url: '/taskByStatus', solutions: true},
      {name: this.status[res.status], url: res.status, solutions: true}];
    this.solutions = navs;
  }

  private getNavsForExams(res: NavNode) {
    const navs = [{name: 'Job4j', url: '/', exams: true},
      { name: 'Экзамены', url: '/exams', exams: true}];
    if (res.name) {
      this.solutions = [...navs, res];
    } else {
      this.solutions = navs;
    }
  }

  private interviews(res: NavNode) {
    const navs = [{name: 'Job4j', url: '/', interview: true},
      { name: 'Собеседования', url: '/interviews', interview: true}];
    if (res.name) {
      this.solutions = [...navs, res];
    } else {
      this.solutions = navs;
    }
  }

  private rating(res: NavNode) {
    const navs = [{name: 'Job4j', url: '/', interview: true},
      { name: 'Рейтинг', url: '/rating/likes', interview: true}];
    if (res.name) {
      this.solutions = [...navs, res];
    } else {
      this.solutions = navs;
    }
  }

  private getNavsForUpdates(res: NavNode) {
    const navs = [{name: 'Job4j', url: '/', interview: true},
      { name: 'Обновления', url: '/updates', interview: true}];
    this.solutions = navs;
  }
}
