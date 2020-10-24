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
  bookmarks: BookmarksModel[] = [];
  provenTasks: ResponseModel[] = [];
  newTasks: ResponseModel[] = [];


  constructor(
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
    this.getBookmarks();
    this.getBookSubscribe();
    // this.getTree();
  }

  showNew() {
    this.newTask = !this.newTask;
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
}
