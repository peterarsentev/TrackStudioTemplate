import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { TaskModel } from '../../../shared/models/task.model';
import { EmergencyModel } from '../../../shared/models/emergency.model';
import { NavNode } from '../../../shared/models/nav.node';
import { NavService } from '../../../shared/services/nav.service';

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
  solutions: NavNode[] = [];
  private taskCodeId: string;
  private topicId: string;
  private solutionId: string;
  @Output()getMessage = new EventEmitter();

  constructor(private route: ActivatedRoute,
              private navService: NavService,
              private router: Router,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.navService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.getMessage.emit();
        if (res) {
          this.topicId = res.topicId ? '' + res.topicId : undefined;
          this.taskCodeId = res.taskId ? '' + res.taskId : undefined;
          if (this.router.url !== '/login') {
            if (res.exercise) {
              this.getNavsForTasks();
            }
            if (res.task_code) {
              this.getNavsForSolutions();
            }
            if (res.discuss) {
              this.getNavsForDiscuss();
            }
            if (!res.task_code && !res.exercise && ! res.discuss) {
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
  getNavsForSolutions() {
    this.tasksService.getNavsForSolutions(this.topicId, this.taskCodeId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.solutions = res);
  }

  getNavsForTasks() {
    this.tasksService.getNavsForTasks(this.topicId, this.taskCodeId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.solutions = res);
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
      if (!!nav.topicId) {
        this.router.navigate([`${nav.url}`, `${nav.topicId}`]);
      } else {
        this.router.navigate([`${nav.url}`]);
      }
      return;
    }
  }

}
