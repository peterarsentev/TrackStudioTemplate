import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { TaskModel } from '../../../shared/models/task.model';
import { EmergencyModel } from '../../../shared/models/emergency.model';
import { NavNode } from '../../../shared/models/nav.node';

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
  @Output() emitter: EventEmitter<TaskModel[]> = new EventEmitter<TaskModel[]>();
  private taskCodeId: string;
  private topicId: string;
  private solutionId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap(res => {
          this.taskCodeId = res.taskCodeId;
          this.topicId = res.topicId;
          this.solutionId = res.solutionId;
          return this.tasksService.getNavRout(res.taskId)
        })
      ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.tasks = res.tasks;
      })
    this.getEmergencyMessage();
    this.checkRout();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goToNav(nav: TaskModel) {
    const action  = nav.preferences.includes('V') ? 'task' : 'tasks';
    const taskId = nav.id;

    this.router.navigate([action], {
      queryParams: {
        action,
        taskId
      }
    })
  }

  getClass(idx: number) {
    if (!!this.tasks.length && idx < this.tasks.length - 1)
    return {
      'ref-link': true
    }
  }

  getEmergencyMessage() {
    this.tasksService.getEmergencyMessage()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.emergency = res.emergency;
      });
  }

  private checkRout() {
    this.checkUrl(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url: string = event.url;
        this.checkUrl(url);
      })
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
        .subscribe(res => {
          this.solutions = res
        })
      this.solution = true;
    }
  }

  goToSol(nav: NavNode) {
    if (!!nav.taskCodeId) {
      this.router.navigate([`${nav.url}`], {queryParams: {
          topicId: nav.topicId,
          solutionId: this.solutionId,
          taskCodeId: nav.taskCodeId
        }});
      return;
    }
    if (!!nav.topicId) {
      this.router.navigate([`${nav.url}`], {queryParams: {
        topicId: nav.topicId
        }});
      return;
    }
    this.router.navigate([`${nav.url}`]);
  }
}
