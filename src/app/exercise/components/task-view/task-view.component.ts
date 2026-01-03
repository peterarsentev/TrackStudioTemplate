import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserEduModels } from '../../../shared/models/userEduModels';
import { CommentAndButtonsModel } from '../../../shared/models/commentAndButtonsModel';
import { CommentService } from '../../../shared/services/comment.service';
import { MessagesModel } from '../../../shared/models/messages.model';
import { NavService } from '../../../shared/services/nav.service';
import { NavNode } from '../../../shared/models/nav.node';
import { UserService } from '../../../shared/services/user.service';
import { UserModels } from '../../../shared/models/user.models';
import { ModalService, TypeModals } from '../../../shared/modal.service';
import { DiscussionMessageModel } from '../../../shared/models/discussionMessageModel';
import { MessageService } from '../../../shared/services/message.service';
import { RateModel } from '../../../shared/models/rate.model';
import { DiscussionBlockComponent } from '../../../shared/components/discussion-block/discussion-block.component';
import {RecentlySolvedModels} from '../../../shared/models/recently-solved-models';
import {EditorConfiguration} from 'codemirror';
import { HostListener } from '@angular/core';
import { AssistantService } from '../../../../assistant/assistant/assistant.service';
import {DOCUMENT} from '@angular/common';
import {RoleService} from '../../../shared/services/role.service';
import { Title } from '@angular/platform-browser';

declare var CodeMirror: any;
declare var hljs: any;
declare const window: any;

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit, OnDestroy {

  topicId;
  taskId;
  showCommentForm: boolean;
  task: TaskTopicModel = {};
  messages: MessagesModel[] = [];
  handlers: UserEduModels[] = [];
  discussions: DiscussionMessageModel[] = [];
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  operation: { name?: string, id?: number } = {};
  user: UserModels;
  name: string;
  rating: RateModel;
  totalSolutions = 0;
  private solutionId: number;
  taskTime: string;
  showButtonBottom = false;
  @ViewChild(DiscussionBlockComponent, {static: false}) discussComponent: DiscussionBlockComponent;
  updatedGreatThanThreeDays = false;
  recentlySolved: RecentlySolvedModels[] = [];
  code = '';
  canSolveTask = false;

  selectedText = '';
  canCreateDiscuss = false;

  constructor(
              @Inject(DOCUMENT) private document: Document,
              private tasksService: TasksService,
              private navService: NavService,
              private router: Router,
              private commentService: CommentService,
              private userService: UserService,
              private modalService: ModalService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private assistantService: AssistantService,
              private titleService: Title,
              private roleService: RoleService) { }

  ngOnInit() {
    this.getHandlersList();
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$),
        debounceTime(200))
      .subscribe(res =>  {
        this.taskId = res.id;
        this.topicId = res.topicId;
        this.solutionId = res.solutionId;
        this.getTotalSolutions();
        this.getDiscussions();
        this.navService.setUpModel({...new NavNode(), topicId: this.topicId, taskId: this.taskId, exercise: true});
        this.getTaskById(res.id);
        this.getRate();
        this.getTaskTime();
        this.tasksService.getRecentlySolved(res.id)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe(it => this.recentlySolved = it);
      });

    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.user = res;
        this.roleService.getRulesForCurrentSession()
          .subscribe(rs => {
            this.canSolveTask = !!rs.find(rule => rule.key === 'CAN_SOLVE_TASK');
            this.canCreateDiscuss = !!rs.find(rule => rule.key === 'DISCUSS_CAN_CREATE');
          });
      });

  }

  @HostListener('document:selectionchange', ['$event'])
  checkSelection(event: MouseEvent): void {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();
      if (selectedText.trim() !== '') {
        const rect = range.getBoundingClientRect();
        this.selectedText = selectedText;
      }
    }
  }

  getTaskById(id: string) {
    this.tasksService.getTaskById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.task = res;
        this.titleService.setTitle(this.task.task.name);
        this.solutionId = res.solution ? res.solution.id : undefined;
        this.updatedGreatThanThreeDays = this.isUpdatedGreatThanThreeDays();
        this.name = this.task.task.name;
        if (this.task.status.start) {
          this.messages = [];
        }
        if (this.solutionId) {
          this.getMessages(this.solutionId);
        } else {
          this.messages = [];
        }
        this.prepareCode();
        this.updateImages();
      });
  }

  goBackToList(taskId?: number) {
    if (!taskId || taskId === -1) {
      this.showCommentForm = false;
      this.router.navigate(['exercise', `${this.topicId}`]).then(() => window.scrollTo(0, 0));
    } else {
      this.showCommentForm = false;
      this.router.navigate(['exercise', `${this.topicId}`, 'task-view', `${taskId}`])
        .then(() => window.scrollTo(0, 0));
    }
  }

  getHandlersList() {
    return this.tasksService.getHandlers()
      .pipe( takeUntil(this.ngUnsubscribe$))
      .subscribe(handlers => {
        this.handlers = handlers;
      });
  }

  goToComments(operation: { name: string, id: number }) {
    this.operation = operation;
    if (operation.id === 3) {
      this.modalService.openDialog(TypeModals.ARE_YOU_SURE)
        .subscribe(res => {
          if (res) {
            this.saveComment(
              {saveAndUp: false, close: false, saveAndNext: true, save: false, handlerId: '' + this.user.id, description: ''});
          }
        });
      return;
    }
    if (this.task.task.type === 2) {
      this.operation = {name: 'Отправить на проверку', id: 3};
      const commentAndButtonsModel = new CommentAndButtonsModel();
      commentAndButtonsModel.saveAndUp = true;
      commentAndButtonsModel.description = 'Ознакомился(лась)';
      commentAndButtonsModel.handlerId = this.user.id;
      commentAndButtonsModel.saveAndNext = true;
      this.saveComment(commentAndButtonsModel);
      return;
    }
    setTimeout(() => {
      const el = document.querySelector('.com');
      el.scrollIntoView({behavior: 'smooth'});
    }, 1);
    this.showCommentForm = true;
  }

  saveComment(button: CommentAndButtonsModel) {
    this.showCommentForm = false;
    this.messages = [];
    const textComment = this.task.task.type === 1 ? button.description + '<pre><code class="java">' + this.code + '</code></pre>' : button.description;
    if (this.task.status.id === 1 && this.task.solution === undefined) {
      this.tasksService.createSolutionAndAddComment(this.task.task.id, this.operation.id, button.handlerId, textComment)
        .subscribe((res) => {
          this.solutionId = res.solutionId;
          this.getTaskById(this.taskId);
          this.commentService.setUpModel(true);
        }, error => {
          if (error.status  === 403) {
            alert('У вас нет прав на эту операцию!');
          }
        });
    } else {
      this.tasksService.updateSolutionAndAddComment(
        this.task.task.id, this.task.solution.id, this.operation.id, button.handlerId, textComment)
        .subscribe(() => {
          if (!button.saveAndNext) {
            this.getTaskById(this.taskId);
          }
          this.commentService.setUpModel(true);
        }, error => {
          if (error.status  === 403) {
            alert('У вас нет прав на эту операцию!');
          }
        });
    }
    if (button.saveAndUp) {
      window.scrollTo(0, 0);
    }
    if (button.saveAndNext) {
      if (this.task.nextId === -1) {
        this.router.navigate(['exercise', `${this.topicId}`]);
        window.scrollTo(0, 0);
      } else {
        this.router.navigate(['exercise', `${this.topicId}`, 'task-view', `${this.task.nextId}`]);
        window.scrollTo(0, 0);
      }
    }
  }

  private getMessages(id: number) {
    this.tasksService.getOperations(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.messages = res;
        this.messages.forEach(message =>
          message.submitter.mentor = (!!this.handlers.find(h => h.name === message.submitter.name)
            || message.submitter.email === 'ci_bot@gmail.com'));
        this.prepareCode();
        this.updateImages();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  getSolutionId() {
    if (!!this.task.task) {
      let res = ' [#' + this.task.task.number;
      if (this.task.solution) {
        res += ' #' + this.task.solution.id;
      }
      res += ']';
      return res;
    }
    return '';
  }

  private updateImages() {
    setTimeout(() => {
      document.querySelectorAll('a img').forEach((block) => {
        block.parentElement.setAttribute('data-lightbox', 'images');
      });
    }, 0);
  }

  getDiscussions() {
    this.messageService.getDiscussions(this.taskId, undefined)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.discussions = res);
  }

  private prepareCode() {
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach((block) => {
        const canRun = block.parentElement.className.indexOf('run_') > -1;
        const java = block.parentElement.className.indexOf('run_main') > -1;
        const golang = block.parentElement.className.indexOf('run_golang') > -1;

        this.sandBoxWidget(block, java, canRun, golang);
      });
    }, 0);
  }

  private sandBoxWidget(block, java, canRun, golang) {
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

    runButton.classList.add('btn', 'btn-success', 'btn-sm', 'me-1');
    runButton.innerHTML = '<i class="fa fa-caret-right me-1"></i>Запустить';

    copyButton.classList.add('btn', 'btn-outline-light', 'btn-sm');
    copyButton.innerHTML = '<i class="fa fa-copy me-1"></i>Копировать';

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

    const code = CodeMirror.fromTextArea(codeEl, {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'text/x-java',
      indentUnit: 4,
      indentWithTabs: false,
      theme: "dracula"
    } as EditorConfiguration);

    const runCode = (output, runButton) => {
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
      } else if (golang) {
        this.tasksService.runGoLang(code.getValue()).subscribe(handleResponse, handleError);
      } else {
        this.tasksService.runSql(code.getValue()).subscribe(handleResponse, handleError);
      }
    };

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
        indentUnit: 4,
        indentWithTabs: false,
        theme: "dracula"
      } as EditorConfiguration);

      code.on('keydown', (cm, event) => {
        if (event.shiftKey && event.key === 'Enter') {
          event.preventDefault();
          runCode(output, runButton)
        }
      });
      runButton.addEventListener('click', () => runCode(output, runButton));
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

  closeDiscussion(text: string) {
    if (!!text) {
      this.submitComment(text);
    }
  }

  submitComment(text: string) {
    this.messageService.addDiscussion(this.taskId, text, undefined)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.getDiscussions();
      }, error => {
        if (error.status === 403) {
          alert('У вас нет прав на эту операцию!');
        }
      });
  }

  updateDiscussion(discussion: DiscussionMessageModel) {
    this.messageService.updateDiscussion(discussion)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {});
  }

  vote(accept: boolean) {
    if (accept && this.rating.vote === 'NO') {
      this.tasksService.voteUp(this.taskId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (accept && this.rating.vote === 'DOWN' || !accept && this.rating.vote === 'UP') {
      this.tasksService.voteClear(this.taskId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (!accept && this.rating.vote === 'NO') {
      this.tasksService.voteDown(this.taskId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
    if (accept && this.rating.vote === 'UP' || !accept && this.rating.vote === 'DOWN') {
      this.tasksService.voteClear(this.taskId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.getRate());
    }
  }

  private getRate() {
    this.tasksService.getRate(this.taskId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.rating = res.rate;
      });
  }

  deleteDiscussion(discussion: DiscussionMessageModel) {
    this.messageService.deleteDiscussion(discussion.id)
      .pipe(switchMap(() => this.messageService.getDiscussions(this.taskId, undefined)),
        takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.discussions = res);
  }

  goToSolutions() {
    this.router.navigate(['/exercise', this.task.task.topicId, 'task-view', this.task.task.id, 'solutions']);
  }

  getTotalSolutions() {
    console.log(this.taskId);
    this.tasksService.getSolutionsCount(this.taskId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.totalSolutions = res.totalCount;
      });
  }

  addResponse(data: DiscussionMessageModel) {
    if (!!data.text) {
      this.messageService.addDiscussion(data.taskId, data.text, data.exerciseId, data.discussId, data.sqlExerciseId, data.parentId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.getDiscussions();
        });
    }
  }

  copyTitle() {
    const title = this.task.task.name + '' +  this.getSolutionId();
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = title;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  private getTaskTime() {
    this.tasksService.getTaskTime(this.taskId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        res => {
          if (!!res && res.second) {
            let delta = res.second;
            // calculate (and subtract) whole days
            const days = Math.floor(delta / 86400);
            delta -= days * 86400;
            const hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            const minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;
            const seconds = Math.round(delta % 60);
            this.taskTime = days + ' дней ' + hours + ' часов ' + seconds + ' сек.';
          }
        }
      );
  }

  showButton() {
    this.showButtonBottom = true;
  }

  showDiscussionForm() {
    this.discussComponent.showDiscussionForm();
  }

  isUpdatedGreatThanThreeDays(): boolean {
    if (this.task.solution === undefined) {
      return false;
    }
    const updatedTime = this.task.solution.updatedTime;
    const now = Date.now();
    const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
    return this.task.status.id === 3 && (now - updatedTime) > threeDaysInMillis;
  }

  openProfile(userId, login) {
    this.router.navigate(['user', userId], { state: { login } });
  }

  openNewTab() {
    localStorage.setItem('assistant', this.selectedText);
    const baseHref = this.document.getElementsByTagName('base')[0].href;
    const url = this.router.serializeUrl(this.router.createUrlTree(['assistant']));
    window.open(baseHref + url, '_blank');
  }
}
