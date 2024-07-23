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
import { DiscussionMessageModel } from '../../../shared/models/discussionMessageModel';
import { UserService } from '../../../shared/services/user.service';
import { RateModel } from '../../../shared/models/rate.model';
import { CommentService } from '../../../shared/services/comment.service';
import {EditorConfiguration} from 'codemirror';

declare var CodeMirror: any;
declare var hljs: any;
declare const window: any;

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
  discussions: DiscussionMessageModel[] = [];
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
        this.prepareCode();
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
      this.goTo(this.previousAndNext.nextId);
    }
  }

  addToFavorite() {
    // if (!this.disable) {
    //   this.messageService.addToFavorite(this.task.string, this.task.id, false)
    //     .pipe(takeUntil(this.ngUnsubscribe$))
    //     .subscribe(() => {
    //       this.disable = true;
    //       this.bookmarksService.setUpModel(true);
    //     });
    // }
  }

  getDiscussions() {
    this.messageService.getDiscussions(+this.task.shortname, undefined)
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
    this.tasksService.getRate(+ this.task.shortname)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.rating = res.rate;
      });
  }

  vote(accept: boolean) {
    if (accept && this.rating.vote === 'NO') {
      this.tasksService.voteUp(+this.task.shortname)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (accept && this.rating.vote === 'DOWN' || !accept && this.rating.vote === 'UP') {
      this.tasksService.voteClear(+this.task.shortname)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (!accept && this.rating.vote === 'NO') {
      this.tasksService.voteDown(+this.task.shortname)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (accept && this.rating.vote === 'UP' || !accept && this.rating.vote === 'DOWN') {
      this.tasksService.voteClear(+this.task.shortname)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
  }

  private prepareCode() {
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach((block) => {
        const canRun = block.parentElement.className.indexOf('run_') > -1;
        const java = block.parentElement.className.indexOf('run_main') > -1;
        this.sandBoxWidget(block, java, canRun);
      });
    }, 0);
  }

  private sandBoxWidget(block, java, canRun) {
    // Create elements
    const codeEl = document.createElement('textarea');
    const outputEl = document.createElement('textarea');
    const buttonContainer = document.createElement('div');
    const runButton = document.createElement('button');
    const copyButton = document.createElement('button');
    const div = document.createElement('div');
    const divEnd = document.createElement('div');

    // Add classes and inner text
    div.classList.add('pt-2');
    div.innerText = 'Вывод:';
    divEnd.classList.add('mt-3');
    buttonContainer.classList.add('mt-3', 'mb-1', 'd-flex', 'gap-2');

    runButton.classList.add('btn', 'btn-success', 'btn-sm');
    runButton.innerHTML = '<i class="fa fa-caret-right mr-1"></i>Запустить';

    copyButton.classList.add('btn', 'btn-light', 'btn-sm', 'ml-2');
    copyButton.innerHTML = '<i class="fa fa-copy mr-1"></i>Копировать';

    // Append buttons to the button container
    if (canRun) {
      buttonContainer.appendChild(runButton);
    }
    buttonContainer.appendChild(copyButton);

    // Insert elements before the block
    block.parentElement.before(buttonContainer);
    block.parentElement.before(codeEl);
    if (canRun) {
      block.parentElement.before(div);
      block.parentElement.before(outputEl);
    }
    block.parentElement.before(divEnd);

    // Initialize CodeMirror
    const code = CodeMirror.fromTextArea(codeEl, {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'text/x-java',
    } as EditorConfiguration);

    // Set initial code value
    code.getDoc().setValue(
      block.innerHTML
        .split('<br>').join('\r\n')
        .split('&gt;').join('>')
        .split('&lt;').join('<')
        .split('&amp;').join('&')
    );

    // Fun error handler
    const handleError = (err) => {
      // Fun error message
      const messages = [
        'Oops! Something went wrong. 🤷‍♂️',
        'Whoops! Looks like the code ran into a snag. 🥴',
        'Error! The gremlins are at it again! 👾',
        'Yikes! The code hit a bump in the road. 🚧',
        'Oh no! Something broke. We\'ll fix it! 🛠️',
      ];
      const message = messages[Math.floor(Math.random() * messages.length)];
      alert(`${message}\n\nError details: ${err}`);

      // Re-enable the button and revert the icon
      runButton.disabled = false;
      runButton.innerHTML = '<i class="fa fa-caret-right mr-1"></i>Запустить';
    };

    // Run button event listener
    if (canRun) {
      const output = CodeMirror.fromTextArea(outputEl, {
        lineNumbers: true,
        matchBrackets: true,
        mode: 'text/x-java',
      } as EditorConfiguration);

      runButton.addEventListener('click', () => {
        // Disable the button and change the icon to loading
        runButton.disabled = true;
        const originalIcon = runButton.innerHTML;
        runButton.innerHTML = '<i class="fa fa-spinner fa-spin mr-1"></i>Загрузка...';

        const handleResponse = (model) => {
          output.getDoc().setValue(model.output);
          // Enable the button and revert the icon
          runButton.disabled = false;
          runButton.innerHTML = originalIcon;
        };

        if (java) {
          this.tasksService.runJava(code.getValue()).subscribe(handleResponse, handleError);
        } else {
          this.tasksService.runSql(code.getValue()).subscribe(handleResponse, handleError);
        }
      });
    }

    // Copy button event listener
    copyButton.addEventListener('click', () => {
      const codeText = code.getValue();
      navigator.clipboard.writeText(codeText).then(() => {
        const originalIcon = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fa fa-check mr-1"></i>Скопировано';
        setTimeout(() => {
          copyButton.innerHTML = originalIcon;
        }, 2000); // Revert icon back after 2 seconds
      }).catch(err => {
        alert('Failed to copy code: ' + err);
      });
    });

    // Remove the original block element
    block.parentElement.parentElement.removeChild(block.parentElement);
  }

}
