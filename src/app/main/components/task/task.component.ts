import {Component, OnDestroy, OnInit, Pipe, PipeTransform} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { pipe, Subject } from 'rxjs';
import { ButtonCommentModel } from '../../../shared/models/button.comment.model';
import { MessagesModel } from '../../../shared/models/messages.model';
import { PreviousNextNavModels } from '../../../shared/models/previous.next.nav.models';
import { CommentButtonsModel } from '../../../shared/models/comment.buttons.model';
import {StatusModel} from '../../../shared/models/status.model';
import {UserModels} from '../../../shared/models/user.models';
import { MessageService } from '../../../shared/services/message.service';
import { BookmarksService } from '../../../shared/services/bookmarks.service';

declare var hljs: any;

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {

  task: TaskModel = {};
  status: StatusModel = {};
  handler: UserModels = {};
  previousAndNext: PreviousNextNavModels = {};
  messages: MessagesModel[] = [];
  buttons: ButtonCommentModel[] = [];
  mstatusId: string;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  showCommentForm: boolean;
  disable = false;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private bookmarksService: BookmarksService,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.getTask()
  }

  private getTask() {
    this.route.queryParams.pipe(
      switchMap(res => {
        console.log('res', res)
        return this.tasksService.getTask(res.taskId, res.action, '1');
      }),
      switchMap(resp => {
        this.task = resp.task;
        this.status = resp.status;
        this.handler = resp.handler;
        return this.tasksService.getNextAndPreviousTasks(this.task.id);
      })
    ).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.previousAndNext = res;
        this.getMessages(this.task.id);
        this.getButtons(this.task.id);
        setTimeout(() => {
          document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
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
    }
    if (button.saveAndUp) {
      window.scrollTo(0, 0);
      this.getMessages(this.task.id);
      this.getButtons(this.task.id);
    }
    if (button.saveAndNext) {
      this.goTo(this.previousAndNext.next)
    }
  }

  addToFavorite() {
    console.log('add')
    if (!this.disable) {
      this.messageService.addToFavorite(this.task.string, this.task.id, false)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.disable = true;
          this.bookmarksService.setUpModel(true);
        })
    }
  }
}
