import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { pipe, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { UserModels } from '../../../shared/models/user.models';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { NavigationEnd, Router } from '@angular/router';
import { TasksService } from '../../../shared/services/tasks.service';
import { ResponseModel } from '../../../shared/models/response.model';
import { IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS, TreeComponent } from 'angular-tree-component';
import { TreeNodeModel } from '../../../shared/models/tree.node.model';

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
  proven = true;
  newTask = true;
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

    this.processingRout();
    this.skipSideBar();

    this.getNavNodes();
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

  private skipSideBar() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.navShow = this.router.url != '/login';
      if (this.navShow) {
        if (!this.newTasks.length) {  this.getNewTasks(); }
        if (!this.provenTasks.length) {   this.getProvenTasks(); }
      }
    });
  }

  private processingRout() {
    this.navShow = this.router.url != '/login';
    if (this.navShow) {
      this.getProvenTasks();
      this.getNewTasks();
    }
  }

  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this),
    useCheckbox: false,
    nodeHeight: 22,
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          if (!node.hasChildren) this.router.navigate(['task'], {
            queryParams: {
              action: 'task',
              taskId: node.data.taskId
            }
          })
        }
      }
    },
  };

  @ViewChild('tree', {static: false})
  private tree: TreeComponent;
  nodes: any = [];

  getChildren(node: any) {
    this.navigete(node);
    return this.tasksService.getTaskByProjectId(node.data.taskId)
      .pipe(
        take(1),
        map(res => {
          const children: TreeNodeModel[] = [];
          res.tasks.forEach(t => children.push(new TreeNodeModel(t.task.name, t.task.childrenCount > 0, t.task.id)));
          return children;
        })
      ).toPromise();
  }

  private getNavNodes() {
    this.tasksService.getNavRout('1')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        console.log('navs', res)
        this.nodes = [new TreeNodeModel(res.tasks[0].name, res.tasks[0].childrenCount > 0, res.tasks[0].id)];
      })
  }

  private navigete(node: any) {
    console.log(node)
    if (node.data.hasChildren) {
      this.router.navigate(['tasks'], {
        queryParams: {
          action: 'tasks',
          taskId: node.data.taskId
        }
      });
    }
  }
}
