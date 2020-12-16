import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { BookmarksModel } from '../../../shared/models/bookmarks.model';
import { MessageService } from '../../../shared/services/message.service';
import { BookmarksService } from '../../../shared/services/bookmarks.service';
import { ResponseModel } from '../../../shared/models/response.model';
import { CommentService } from '../../../shared/services/comment.service';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import { VerifiedTasksModel } from '../../../shared/models/verifiedTasksModel';
import { NavService } from '../../../shared/services/nav.service';

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
  tasks$ = this.taskService.getTasksTopicsList();
  items = true;
  tasks = true;
  // bookmarks: BookmarksModel[] = [];
  provenTasks: TaskTopicModel[] = [];
  newTasks: TaskTopicModel[] = [];


  constructor(
    private navService: NavService,
    private router: Router,
    private taskService: TasksService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private bookmarksService: BookmarksService,
    private tasksService: TasksService,
    private commentService: CommentService,
  ) { }

  ngOnInit() {
    this.loadTasks();
    this.getProvenTasks();
    this.getNewTasks();
    // this.getBookmarks();
    // this.getBookSubscribe();
    // this.getTree();
  }

  showNew() {
    this.newTask = !this.newTask;
  }

  getSolutionId(task: TaskTopicModel) {
    if (!task.solution) {return ''; }
    return ' [#'+ task.solution.id + ']';
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

  // getBookmarks() {
  //   this.messageService
  //     .getBookmarks()
  //     .pipe(takeUntil(this.ngUnsubscribe$))
  //     .subscribe((res) => (this.bookmarks = res.bookmarks));
  // }

  // private getBookSubscribe() {
  //   this.bookmarksService
  //     .getModel()
  //     .pipe(takeUntil(this.ngUnsubscribe$))
  //     .subscribe(() => this.getBookmarks());
  // }

  showProven() {
    this.proven = !this.proven;
  }

  showItems() {
    this.items = !this.items;
  }

  goToBook(book: BookmarksModel) {
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

  scroll() {
    window.scrollTo(0, 0);
  }

  showTasks() {
    this.tasks = !this.tasks;
  }

  setNaw() {
    this.navService.setUpModel({});
  }
}
