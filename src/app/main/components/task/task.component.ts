import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Subject } from 'rxjs';
import { ButtonCommentModel } from '../../../shared/models/button.comment.model';
import { MessagesModel } from '../../../shared/models/messages.model';
import { PreviousNextNavModels } from '../../../shared/models/previous.next.nav.models';
import { CommentAndButtonsModel } from '../../../shared/models/commentAndButtonsModel';
import { StatusModel } from '../../../shared/models/status.model';
import { UserModels } from '../../../shared/models/user.models';
import { MessageService } from '../../../shared/services/message.service';
import { BookmarksService } from '../../../shared/services/bookmarks.service';
import { DiscussionModel } from '../../../shared/models/discussionModel';
import { UserService } from '../../../shared/services/user.service';
import { RateModel } from '../../../shared/models/rate.model';
import { CommentService } from '../../../shared/services/comment.service';

declare var CodeMirror: any;
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
  user: UserModels;
  rating: RateModel;
  handlers: UserModels[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private commentService: CommentService,
              private messageService: MessageService,
              private bookmarksService: BookmarksService,
              private userService: UserService,
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
        this.getRate();
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
        this.getHandlersList();
        setTimeout(() => {
          document.querySelectorAll('pre code').forEach((block) => {
            if (block.parentElement && block.parentElement.className.indexOf('run_main') > -1) {
              const codeEl = document.createElement('textarea');
              const outputEl = document.createElement('textarea');
              const button = document.createElement('button');
              const div = document.createElement('div');
              const divEnd = document.createElement('div');
              div.classList.add('pt-2');
              div.innerText = 'Вывод:';
              divEnd.classList.add('mt-3');
              button.classList.add('mt-3');
              button.classList.add('mb-1');
              button.classList.add('m');
              button.classList.add('btn');
              button.classList.add('btn-success');
              button.classList.add('btn-sm');
              const i = document.createElement('i');
              i.classList.add('fa');
              i.classList.add('fa-caret-right');
              i.classList.add('mr-1');
              button.append(i);
              button.append('Запустить');
              block.parentElement.before(button);
              block.parentElement.before(codeEl);
              block.parentElement.before(div);
              block.parentElement.before(outputEl);
              block.parentElement.before(divEnd);
              const code = CodeMirror.fromTextArea(codeEl, {
                lineNumbers: true,
                matchBrackets: true,
                mode: 'text/x-java'
              });
              const output = CodeMirror.fromTextArea(outputEl, {
                lineNumbers: true,
                matchBrackets: true,
                mode: 'text/x-java'
              });
              code.getDoc().setValue(
                block.innerHTML
                  .split('<br>').join('\r\n')
                  .split('&gt;').join('>')
                  .split('&lt;').join('<')
                  .split('&amp;').join('&')
              );
              button.addEventListener('click', () => {
                this.tasksService.runCode(code.getValue())
                  .subscribe((model) => {
                    output.getDoc().setValue(model.output);
                  });
              });
              block.parentElement.parentElement.removeChild(block.parentElement);
            } else {
              hljs.highlightBlock(block);
            }
          });

          document.querySelectorAll('a img').forEach((block) => {
            block.parentElement.setAttribute('data-lightbox', 'images');
          });
        }, 0);
      });

    this.userService.getModel()
      .pipe(
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => {
      this.user = res;
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
      const el = document.querySelector('.end');
      el.scrollIntoView({behavior: 'smooth', block: 'end'});
    }, 1);
  }

  private getMessages(taskId: string) {
    this.tasksService.getMessages(taskId)
      .subscribe(res => {
        this.messages = res.messages;
      });
  }

  private getButtons(taskId: string) {
    this.tasksService.getButtonsForTask(taskId)
      .subscribe((buttons) => {
        this.buttons = buttons.mstatuses;
      });
  }

  goTo(task: TaskModel) {
    window.scroll(0, 0);
    this.router.navigate(['task'], {
      queryParams: {
        action: 'task',
        taskId: task.id,
        number: task.number
      }
    });
  }

  getHandlersList() {
    return this.tasksService.gerResponsiblePeople(this.task.id, this.mstatusId)
      .pipe( takeUntil(this.ngUnsubscribe$))
      .subscribe(handlers => {
        this.handlers = handlers.handlers;
      });
  }

  saveComment(button: CommentAndButtonsModel) {
    this.showCommentForm = false;
    this.tasksService.sendComment(this.task.id, this.mstatusId, button.handlerId, button.description)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.commentService.setUpModel(true);
      });
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
      });
      this.getMessages(this.task.id);
      this.getButtons(this.task.id);
    }
    if (button.saveAndNext) {
      this.goTo(this.previousAndNext.next);
    }
  }

  addToFavorite() {
    if (!this.disable) {
      this.messageService.addToFavorite(this.task.string, this.task.id, false)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.disable = true;
          this.bookmarksService.setUpModel(true);
        });
    }
  }

  getDiscussions() {
    this.messageService.getDiscussions(+this.task.shortname)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.discussions = res);
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

  private getRate() {
    this.tasksService.getRate(this.task.shortname)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.rating = res.rate;
      });
  }

  vote(accept: boolean) {
    if (accept && this.rating.vote === 'NO') {
      this.tasksService.voteUp(this.task.shortname)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (accept && this.rating.vote === 'DOWN' || !accept && this.rating.vote === 'UP') {
      this.tasksService.voteClear(this.task.shortname)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (!accept && this.rating.vote === 'NO') {
      this.tasksService.voteDown(this.task.shortname)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (accept && this.rating.vote === 'UP' || !accept && this.rating.vote === 'DOWN') {
      this.tasksService.voteClear(this.task.shortname)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
  }
}
