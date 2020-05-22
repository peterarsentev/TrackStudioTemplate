import { Component, OnDestroy, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Subject } from 'rxjs';
import { ButtonCommentModel } from '../../../shared/models/button.comment.model';
import { MessagesModel } from '../../../shared/models/messages.model';
import { PreviousNextNavModels } from '../../../shared/models/previous.next.nav.models';
import { CommentButtonsModel } from '../../../shared/models/comment.buttons.model';
import { StatusModel } from '../../../shared/models/status.model';
import { UserModels } from '../../../shared/models/user.models';
import { MessageService } from '../../../shared/services/message.service';
import { BookmarksService } from '../../../shared/services/bookmarks.service';
import { DiscussionModel } from '../../../shared/models/discussionModel';

declare var hljs: any;

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskComponent implements OnInit, OnDestroy {

  task: TaskModel = {};
  status: StatusModel = {};
  handler: UserModels = {};
  previousAndNext: PreviousNextNavModels = {};
  messages: MessagesModel[] = [];
  buttons: ButtonCommentModel[] = [];
  mstatusId: string;
  discussions: DiscussionModel[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  showCommentForm: boolean;
  disable = false;
  operationName: string;
  showDiscussion: boolean;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private bookmarksService: BookmarksService,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.getTask();

  }

  private getTask() {
    this.route.queryParams.pipe(
      switchMap(res => {
        return this.tasksService.getTask(res.taskId, res.action, '1');
      }),
      switchMap(resp => {
        this.task = resp.task;
        this.status = resp.status;
        this.handler = resp.handler;
        this.getDiscussions();
        return this.tasksService.getNextAndPreviousTasks(this.task.id);
      })
    ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.previousAndNext = res;
        this.getMessages(this.task.id);
        this.getButtons(this.task.id);
        this.showCommentForm = false;
        setTimeout(() => {
          document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
          });

          document.querySelectorAll('a img').forEach((block) => {
            block.parentElement.setAttribute('data-lightbox', 'images');
          });
        }, 0);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  goToComments(button: ButtonCommentModel) {
    this.mstatusId = button.id;
    this.operationName = button.name;
    this.showCommentForm = true;
    setTimeout(() => {
      const el = document.querySelector('.end')
      el.scrollIntoView({behavior: 'smooth', block: 'end'});
    }, 1)
  }

  private getMessages(taskId: string) {
    this.tasksService.getMessages(taskId)
      .subscribe(res => {
        this.messages = res.messages;
      })
  }

  private getButtons(taskId: string) {
    this.tasksService.getButtonsForTask(taskId)
      .subscribe((buttons) => {
        this.buttons = buttons.mstatuses
      });
  }

  goTo(taskId: string) {
    this.router.navigate(['task'], {
      queryParams: {
        action: 'task',
        taskId: taskId
      }
    })
  }

  saveComment(button: CommentButtonsModel) {
    this.showCommentForm = false;
    if (button.save) {
      this.getMessages(this.task.id);
      this.getButtons(this.task.id);
      this.tasksService.getTask(this.task.id, 'task', '1')
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(task => {
          this.task = task.task;
          this.status = task.status;
          this.handler = task.handler;
          window.scrollTo(0, 0);
        });
    }
    if (button.saveAndUp) {
      this.router.navigate(['tasks'], {
        queryParams: {
          action: 'tasks',
          taskId: this.task.parentId
        }
      })
      this.getMessages(this.task.id);
      this.getButtons(this.task.id);
    }
    if (button.saveAndNext) {
      this.goTo(this.previousAndNext.next)
    }
  }

  addToFavorite() {
    if (!this.disable) {
      this.messageService.addToFavorite(this.task.string, this.task.id, false)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.disable = true;
          this.bookmarksService.setUpModel(true);
        })
    }
  }

  getDiscussions() {
    this.messageService.getDiscussions(this.task.shortname)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        console.log(res)
        this.discussions = res;
      });
  }

  showDiscussionForm() {
    this.showDiscussion = !this.showDiscussion;
  }

  closeDiscussion(close: boolean) {
    this.showDiscussion = false;
    if (close) {
      this.getDiscussions();
    }
  }
}
