import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import { pluck, takeUntil } from 'rxjs/operators';
import { DiscussModel } from '../../../../shared/models/discuss.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussService } from '../../discuss.service';
import { Subject } from 'rxjs';
import { DiscussionMessageModel } from '../../../../shared/models/discussionMessageModel';
import { UserService } from '../../../../shared/services/user.service';
import { UserModels } from '../../../../shared/models/user.models';
import { MessageService } from '../../../../shared/services/message.service';
import { NavService } from '../../../../shared/services/nav.service';

@Component({
  selector: 'app-discuss-list-element',
  templateUrl: './discuss-list-element.component.html',
  styleUrls: ['./discuss-list-element.component.scss']
})
export class DiscussListElementComponent implements OnInit, OnDestroy, AfterViewChecked {

  private unsubscribe$ = new Subject();
  discuss: DiscussModel;
  discussions: DiscussionMessageModel[] = [];
  user: UserModels;
  constructor(private router: Router,
              private discussService: DiscussService,
              private userService: UserService,
              private messageService: MessageService,
              public navService: NavService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.navService.setUpModel({discuss: true, taskId: res.id}));
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
    this.deleteNotification();
  }

  ngAfterViewChecked(): void {
    this.updateImages();
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
    if (!!text) {
      this.messageService.addDiscussion(this.discuss.taskId, text, this.discuss.exerciseId, this.discuss.id, this.discuss.sqlExerciseId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          this.discuss.updated = res.discuss.updated;
          this.discuss.subscribed = res.subscribed;
          this.getDiscussions();
        });
    }
  }

  subscribe() {
    this.messageService.makeSubscribeOrRevert(this.discuss.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.discuss.subscribed = res.subscribe);
  }

  private deleteNotification() {
    this.discussService.deleteNotificationByUser(this.discuss.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {});
  }

  private updateImages() {
    setTimeout(() => {
      document.querySelectorAll('a img').forEach((block) => {
        block.parentElement.setAttribute('data-lightbox', 'images');
      });
    }, 0);
  }
}
