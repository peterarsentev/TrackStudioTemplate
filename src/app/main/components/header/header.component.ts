import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UserModels } from '../../../shared/models/user.models';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { NavigationEnd, Router } from '@angular/router';
import { TasksService } from '../../../shared/services/tasks.service';
import { ResponseModel } from '../../../shared/models/response.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  notifications = false;
  count: number;
  toggled = false;
  navShow = true;
  proven = false;
  newTask = false;
  provenTasks: ResponseModel[] = [];
  newTasks: ResponseModel[] = [];

  constructor(private userService: UserService,
              private messageService: MessageService,
              private router: Router,
              public tasksService: TasksService,
              private authService: AuthService) { }

  ngOnInit() {
    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(user => {
        this.user = user
        this.notifications = (!!this.user.name && this.user.name !== 'Аnonymous');
        if (this.notifications) {
          this.getNotifications(this.user.id);
        }
      });
    this.authService.getDefaultProjectId()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {});
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.navShow = this.router.url != '/login')
    this.getProvenTasks();
    this.getNewTasks()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  clearStorage() {
    this.userService.setUpModel({})
    if (this.user.name !== 'Аnonymous') {
     this.authService.logOut()
       .pipe(takeUntil(this.ngUnsubscribe$))
       .subscribe(res => {
         this.notifications = false;
       });
    }
  }

  getNotifications(id: string) {
    this.messageService.getNotifications(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.count = res.total);
  }

  readMessages() {
    this.router.navigate(['/messages']);
  }

  onToggle() {
    this.toggled = !this.toggled;
  }

  showProven() {
    this.proven = !this.proven;
  }

  getProvenTasks() {
    this.tasksService.getTaskByProjectId(localStorage.getItem('defaultProjectId'), undefined, '0873958f661c804c01665919befa18b9')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.provenTasks = res.tasks;
      })
  }

  getNewTasks() {
    this.tasksService.getTaskByProjectIdLimit(
      localStorage.getItem('defaultProjectId'), undefined, '0873958f665da72301665dcf99c50388', '10', '0')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.newTasks = res.tasks;
      })
  }

  showNew() {
    this.newTask = !this.newTask;
  }
}
