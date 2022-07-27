import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private tasksService: TasksService,
              private navService: NavService,
              private router: Router,
              private commentService: CommentService,
              private userService: UserService,
              private modalService: ModalService,
              private messageService: MessageService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.getHandlersList();
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$),
        debounceTime(200))
      .subscribe(res =>  {
        this.taskId = res.id;
        this.topicId = res.topicId;
        this.getTotalSolutions();
        this.getDiscussions();
        this.navService.setUpModel({...new NavNode(), topicId: this.topicId, taskId: this.taskId, exercise: true});
        this.getTaskById(res.id);
        this.getRate();
      });

    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.user = res);
  }

  getTaskById(id: string) {
    this.tasksService.getTaskById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.task = res;
        this.name = this.task.task.name;
        if (this.task.status.start) {
          this.messages = [];
        }
        if (!!this.task.solution && !!this.task.solution.id) {
          this.getMessages(this.task.solution.id);
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
    setTimeout(() => {
      const el = document.querySelector('.com');
      el.scrollIntoView({behavior: 'smooth'});
    }, 1);
    this.showCommentForm = true;
  }

  saveComment(button: CommentAndButtonsModel) {
    this.showCommentForm = false;
    if (this.task.status.id === 1) {
      this.tasksService.createSolutionAndAddComment(this.task.task.id, this.operation.id, button.handlerId, button.description)
        .subscribe(() => {
          this.getTaskById(this.taskId);
          this.commentService.setUpModel(true);
        }, error => {
          if (error.status  === 403) {
            alert('У вас нет прав на эту операцию!');
          }
        });
    } else {
      this.tasksService.updateSolutionAndAddComment(
        this.task.task.id, this.task.solution.id, this.operation.id, button.handlerId, button.description)
        .subscribe(() => {
          this.getTaskById(this.taskId);
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
        this.updateImages();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  private sandBoxWidget(block, java) {
    const codeEl = document.createElement('textarea');
    const outputEl = document.createElement('textarea');
    const button = document.createElement('button');
    const div = document.createElement('div');
    const divEnd = document.createElement('div');
    div.classList.add('pt-2');
    div.innerText = 'Вывод:';
    divEnd.classList.add('mt-3');
    button.classList.add('mt-3', 'mb-1', 'm', 'btn', 'btn-success', 'btn-sm');
    const i = document.createElement('i');
    i.classList.add('fa', 'fa-caret-right', 'mr-1');
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
      if (java) {
        this.tasksService.runJava(code.getValue())
          .subscribe((model) => {
            output.getDoc().setValue(model.output);
          });
      } else {
        this.tasksService.runSql(code.getValue())
          .subscribe((model) => {
            output.getDoc().setValue(model.output);
          });
      }
    });
    block.parentElement.parentElement.removeChild(block.parentElement);
  }

  private prepareCode() {
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach((block) => {
        if (block.parentElement && block.parentElement.className.indexOf('run_') > -1) {
          const java = block.parentElement.className.indexOf('run_main') > -1;
          this.sandBoxWidget(block, java);
        } else {
          hljs.highlightBlock(block);
        }
      });
      const options = {
        templateSelector: '#CodeBadgeTemplate',
        contentSelector: 'body',
        copyIconClass: 'fa fa-copy',
        checkIconClass: 'fa fa-check text-success',
      };
      window.highlightJsBadge(options);
    }, 0);
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
}
