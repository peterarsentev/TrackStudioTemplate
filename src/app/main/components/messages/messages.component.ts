import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../../shared/services/user.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessageModel } from '../../../shared/models/message.model';
import {TaskModel} from '../../../shared/models/task.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  messages: MessageModel[];
  userId: string;
  constructor(private messageService: MessageService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.userService.getModel()
      .pipe(
        switchMap(user => {
          this.userId = user.id;
          return this.messageService.getMessages(user.id)
        }),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => {
        this.messages = res
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  openTask(task: TaskModel) {
    this.router.navigate(['task'], {
      queryParams: {
        action: 'task',
        taskId: task.id
      }
    })
  }

  deleteMessage(messageId?: string) {
    this.messageService.deleteMessage(messageId)
      .pipe(
        switchMap(() => this.messageService.getMessages(this.userId)),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res =>  this.messages = res)
  }
}
