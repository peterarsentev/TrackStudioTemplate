import { Component, OnDestroy, OnInit } from '@angular/core';
import { pluck, takeUntil } from 'rxjs/operators';
import { DiscussModel } from '../../../../shared/models/discuss.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussService } from '../../discuss.service';
import { Subject } from 'rxjs';
import { MessagesModel } from '../../../../shared/models/messages.model';
import { DiscussionModel } from '../../../../shared/models/discussionModel';
import { UserService } from '../../../../shared/services/user.service';
import { UserModels } from '../../../../shared/models/user.models';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'app-discuss-list-element',
  templateUrl: './discuss-list-element.component.html',
  styleUrls: ['./discuss-list-element.component.scss']
})
export class DiscussListElementComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  discuss: DiscussModel;
  messages: MessagesModel[] = [];
  discussions: DiscussionModel[] = [];
  user: UserModels;
  constructor(private router: Router,
              private discussService: DiscussService,
              private userService: UserService,
              private messageService: MessageService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: DiscussModel) => {
      this.discuss = res;
    });
    this.userService.getModel()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.user = res);
    this.getDiscussions();
  }

    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

  getDiscussions() {
    this.messageService.getDiscuss(this.discuss.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.discussions = res);
  }

  closeDiscussion(text: any) {
    console.log(text);
    if (!!text) {
      this.messageService.addDiscussion(this.discuss.taskId, text, this.discuss.exerciseId, this.discuss.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => this.getDiscussions());
    }
  }
}