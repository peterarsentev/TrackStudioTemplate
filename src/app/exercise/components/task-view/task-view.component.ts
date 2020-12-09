import { Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserEduModels } from '../../../shared/models/userEduModels';
import { CommentAndButtonsModel } from '../../../shared/models/commentAndButtonsModel';
import { CommentService } from '../../../shared/services/comment.service';
import { MessagesModel } from '../../../shared/models/messages.model';
import { NavService } from '../../../shared/services/nav.service';
import { NavNode } from '../../../shared/models/nav.node';

declare var CodeMirror: any;
declare var hljs: any;

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
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  operation :{ name?: string, id?: number } = {};

  constructor(private tasksService: TasksService,
              private navService: NavService,
              private router: Router,
              private commentService: CommentService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res =>  {
        this.taskId = res.id;
        this.topicId = res.topicId
        this.navService.setUpModel({...new NavNode(), topicId: this.topicId, taskId: this.taskId, exercise: true});
        this.getTaskById(res.id);
    })
    this.getHandlersList();
  }

  getTaskById(id: string) {
    this.tasksService.getTaskById(id)
      .subscribe(res => {
        this.task = res;
        if (this.task.solution) {
          this.getMessages(this.task.solution.id);
        }
        setTimeout(() => {
          this.prepareCode();
          document.querySelectorAll('a img').forEach((block) => {
            block.parentElement.setAttribute('data-lightbox', 'images');
          });
        }, 0);
      });
  }

  goBackToList() {
    this.router.navigate(['exercise', `${this.topicId}`])
  }

  goToComments(operation: { name: string, id: number }) {
    setTimeout(() => {
      const el = document.querySelector('.end')
      el.scrollIntoView({behavior: 'smooth', block: 'end'});
    }, 1)
    this.operation = operation;
    this.showCommentForm = true;
  }

  getHandlersList() {
    return this.tasksService.getHandlers()
      .pipe( takeUntil(this.ngUnsubscribe$))
      .subscribe(handlers => {
        this.handlers = handlers;
      })
  }

  saveComment(button: CommentAndButtonsModel) {
    this.showCommentForm = false;
    if (this.task.status.id === 1) {
      this.tasksService.createSolutionAndAddComment(this.task.task.id, this.operation.id, button.handlerId, button.description)
        .subscribe(() => {
          this.getTaskById(this.taskId);
          this.commentService.setUpModel(true);
        })
    } else {
      this.tasksService.updateSolutionAndAddComment(this.task.task.id, this.task.solution.id, this.operation.id, button.handlerId, button.description)
        .subscribe(() => {
          this.getTaskById(this.taskId)
          this.commentService.setUpModel(true);
        })
    }
    if (button.save || button.saveAndUp) {
      // this.getMessages(this.task.id);
      // this.getButtons(this.task.id);
          window.scrollTo(0, 0);
        }
    }

  private getMessages(id: number) {
    this.tasksService.getComments(id)
      .subscribe(res => this.messages = res)
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  private prepareCode() {
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
  }
}
