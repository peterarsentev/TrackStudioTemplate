import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { UserService } from "../../../shared/services/user.service";
import { EMPTY, of, Subject } from "rxjs";
import { filter, map, switchMap, take, takeUntil } from "rxjs/operators";
import { UserModels } from "../../../shared/models/user.models";
import { AuthService } from "../../../shared/services/auth.service";
import { MessageService } from "../../../shared/services/message.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { TasksService } from "../../../shared/services/tasks.service";
import { ResponseModel } from "../../../shared/models/response.model";
import {
  ITreeOptions,
  TREE_ACTIONS,
  TreeComponent,
} from "angular-tree-component";
import { TreeNodeModel } from "../../../shared/models/tree.node.model";
import { TaskModel } from "../../../shared/models/task.model";
import { CommentService } from "../../../shared/services/comment.service";
import { BookmarksModel } from "../../../shared/models/bookmarks.model";
import { BookmarksService } from "../../../shared/services/bookmarks.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  notifications = false;
  count: number;
  toggled = false;
  navShow = true;
  proven = true;
  items = true;
  newTask = true;
  provenTasks: ResponseModel[] = [];
  newTasks: ResponseModel[] = [];
  bookmarks: BookmarksModel[] = [];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private bookmarksService: BookmarksService,
    private router: Router,
    private commentService: CommentService,
    private route: ActivatedRoute,
    public tasksService: TasksService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userService
      .getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((user) => {
        this.user = user;
        this.notifications = !!this.user.name && this.user.name !== "Аnonymous";
        if (this.notifications) {
          this.getNotifications(this.user.id);
          this.executor(this.user.id);
        }
      });
    this.authService
      .getDefaultProjectId()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {});

    this.processingRout();
    this.skipSideBar();

    this.getNavNodes();
    this.loadTasks();
    this.getBookmarks();
    this.getBookSubscribe();
  }

  initResize() {
    const wrapper = document.getElementById("wrapper");
    wrapper.addEventListener("mousemove", this.Resize, false);
  }
  Resize(e) {
    const element = document.getElementById("resizable");
    element.style.minWidth = `${e.clientX}px`;
  }
  stopResize(e) {
    const wrapper = document.getElementById("wrapper");
    console.log("dragend");
    const element = document.getElementById("resizable");
    element.style.minWidth = `${e.clientX}px`;
    wrapper.removeEventListener("mousemove", this.Resize, false);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  clearStorage() {
    this.userService.setUpModel({});
    if (this.user.name !== "Аnonymous") {
      this.authService
        .logOut()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.notifications = false;
        });
    }
  }

  goMain() {
    this.authService
      .login()
      .pipe(
        switchMap(() => this.authService.getDefaultProjectId()),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(() => this.router.navigate(["/"], {}));
  }

  getNotifications(id: string) {
    this.messageService
      .getNotifications(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => (this.count = res.total));
  }

  readMessages() {
    this.router.navigate(["/messages"]);
  }

  onToggle() {
    const elementById = document.getElementById("resizable");
    if (elementById.classList.contains("hide"))
      elementById.classList.remove("hide"); //delete class from clearStorage func
    elementById.classList.toggle("toggle");
  }

  showProven() {
    this.proven = !this.proven;
  }

  getProvenTasks() {
    this.tasksService
      .getTaskByProjectId(
        localStorage.getItem("defaultProjectId"),
        undefined,
        "0873958f661c804c01665919befa18b9"
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.provenTasks = res.tasks;
      });
  }

  getNewTasks() {
    this.tasksService
      .getTaskByProjectIdLimit("0873958f665da72301665dcf99c50388", "10", "0")
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.newTasks = res.tasks;
      });
  }

  showNew() {
    this.newTask = !this.newTask;
  }

  private skipSideBar() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.navShow = this.router.url != "/login";
        if (this.navShow) {
          this.getProvenTasks();
          this.getNewTasks();
        }
      });
  }

  private processingRout() {
    this.navShow = this.router.url != "/login";
    if (this.navShow) {
      this.getProvenTasks();
      this.getNewTasks();
      this.getBookmarks();
    }
  }

  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this),
    useCheckbox: false,
    nodeHeight: 22,

    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          let url = "";
          if (node.hasChildren) {
            url = "tasks";
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
          if (!node.hasChildren) {
            url = "task";
          }
          this.router.navigate([url], {
            queryParams: {
              action: url,
              taskId: node.data.taskId,
              tree: true,
            },
          });
        },
      },
    },
  };

  @ViewChild("tree", { static: false })
  private tree: TreeComponent;
  nodes: any = [];

  getChildren(node: any) {
    return this.tasksService
      .getTaskByProjectId(node.data.taskId)
      .pipe(
        take(1),
        map((res) => {
          const children: TreeNodeModel[] = [];
          res.tasks.forEach((t) =>
            children.push(
              new TreeNodeModel(
                t.task.id,
                t.task.name + " [#" + t.task.number + "]",
                t.task.childrenCount > 0,
                t.task.id,
                t.task.parentId
              )
            )
          );
          return children;
        })
      )
      .toPromise();
  }

  private getNavNodes() {
    this.tasksService
      .getNavRout("1")
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.nodes = [this.makeNode(res.tasks[0])];
      });
  }

  makeNode(task: TaskModel): TreeNodeModel {
    return new TreeNodeModel(
      task.id,
      task.name + " [#" + task.number + "]",
      task.childrenCount > 0,
      task.id
    );
  }

  private navigete(node: any) {
    console.log(node);
    if (node.data.hasChildren) {
      this.router.navigate(["tasks"], {
        queryParams: {
          action: "tasks",
          taskId: node.data.taskId,
        },
      });
    }
  }

  private loadTasks() {
    this.commentService
      .getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        if (res) {
          this.getNewTasks();
          this.getProvenTasks();
        }
      });
  }

  showItems() {
    this.items = !this.items;
  }

  getBookmarks() {
    this.messageService
      .getBookmarks()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => (this.bookmarks = res.bookmarks));
  }

  goToBook(book: BookmarksModel) {
    console.log("boook");
    this.tasksService
      .getTask(book.taskId, "task", "1")
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        const url = res.task.preferences.includes("V") ? "task" : "tasks";
        this.router.navigate([url], {
          queryParams: {
            action: url,
            taskId: res.task.id,
            number: res.task.number,
          },
        });
      });
  }

  private getBookSubscribe() {
    this.bookmarksService
      .getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.getBookmarks());
  }

  deleteBook(book: BookmarksModel) {
    this.messageService
      .deleteBook(book.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.bookmarksService.setUpModel(true));
  }

  private executor(id: string) {
    setInterval(() => {
      this.getNotifications(this.user.id);
    }, 30000);
  }
}
