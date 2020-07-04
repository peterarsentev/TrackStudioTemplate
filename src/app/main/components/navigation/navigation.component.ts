import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { Subject } from 'rxjs';
import { TaskModel } from '../../../shared/models/task.model';
import { EmergencyModel } from '../../../shared/models/emergency.model';

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
  @Output() emitter: EventEmitter<TaskModel[]> = new EventEmitter<TaskModel[]>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap(res => this.tasksService.getNavRout(res.taskId))
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
      .subscribe((event: any) => {
        const url: string = event.url;
        this.checkUrl(url);
      })
  }

  checkUrl(url: string) {
    this.show = url !== '/login';
    console.log(url)
    console.log(this.tasks)
    if (url === '/topics') {
      console.log('topics')
    } else if (url === '/tasks_code_list') {
      console.log('tasks_code_list')
    }
  }

}
