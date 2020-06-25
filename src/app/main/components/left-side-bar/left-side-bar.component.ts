import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { ITreeOptions, TREE_ACTIONS, TreeComponent } from 'angular-tree-component';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { TaskModel } from '../../../shared/models/task.model';
import { TreeNodeModel } from '../../../shared/models/tree.node.model';
import { TasksService } from '../../../shared/services/tasks.service';
import { BookmarksModel } from '../../../shared/models/bookmarks.model';
import { MessageService } from '../../../shared/services/message.service';
import { BookmarksService } from '../../../shared/services/bookmarks.service';
import { ResponseModel } from '../../../shared/models/response.model';
import { CommentService } from '../../../shared/services/comment.service';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  newTask = true;
  navShow = true;
  proven = true;
  @ViewChild("tree", { static: false })
  private tree: TreeComponent;
  nodes: any = [];
  items = true;
  bookmarks: BookmarksModel[] = [];
  provenTasks: ResponseModel[] = [];
  newTasks: ResponseModel[] = [];

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private bookmarksService: BookmarksService,
    private tasksService: TasksService,
    private commentService: CommentService,
  ) { }

  ngOnInit() {
    console.log("init")
    this.loadTasks();
    this.getNavNodes();
    this.getProvenTasks();
    this.getNewTasks();
    this.getBookmarks();
    this.getBookSubscribe();
    this.getTree();
  }

  showNew() {
    this.newTask = !this.newTask;
  }

  private getNavNodes() {
    this.tasksService
      .getNavRout("1")
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.nodes = [
          this.makeNode(res.tasks[0])
        ];
      });
  }

  makeNode(task: TaskModel): TreeNodeModel {
    return new TreeNodeModel(
      task.id,
      task.name + ' [#' + task.number + ']',
      task.childrenCount > 0,
      task.id
    );
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

  getBookmarks() {
    this.messageService
      .getBookmarks()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => (this.bookmarks = res.bookmarks));
  }

  private getBookSubscribe() {
    this.bookmarksService
      .getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.getBookmarks());
  }

  showProven() {
    this.proven = !this.proven;
  }

  showItems() {
    this.items = !this.items;
  }

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
          this.tree.treeModel.getNodeById(node.data.taskId);
          return children;
        })
      ).toPromise();
  }

  private getTree() {
    this.route.queryParams
      .pipe(
        switchMap(res => {
          if (res.tree) return EMPTY;
          if (this.router.url === '/login') return EMPTY;
          return this.tasksService.getNavRout(res.taskId);
        })
      ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        if (res) {
          for (let i = 0; i < res.tasks.length; i++) {
            const exists = this.tree.treeModel.getNodeById(res.tasks[i].id);
            if (exists) {
              exists.expand();
              exists.focus();
            } else {
              setTimeout(() => {
                const node = this.tree.treeModel.getNodeById(res.tasks[i].id);
                node.expand();
                node.focus();
              }, 1000 * i);
            }
          }
        }
      });
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

  deleteBook(book: BookmarksModel) {
    this.messageService
      .deleteBook(book.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.bookmarksService.setUpModel(true));
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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
