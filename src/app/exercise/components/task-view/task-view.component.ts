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
        .subscribe(() => this.getTaskById(this.taskId))
    } else {
      this.tasksService.updateSolutionAndAddComment(this.task.task.id, this.task.solution.id, this.operation.id, button.handlerId, button.description)
        .subscribe(() => this.getTaskById(this.taskId))
    }
    if (button.save) {
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

}
