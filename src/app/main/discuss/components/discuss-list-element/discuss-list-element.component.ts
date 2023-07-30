import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { pluck, switchMap, takeUntil } from 'rxjs/operators';
import { DiscussModel } from '../../../../shared/models/discuss.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussService } from '../../discuss.service';
import { Subject } from 'rxjs';
import { DiscussionMessageModel } from '../../../../shared/models/discussionMessageModel';
import { UserService } from '../../../../shared/services/user.service';
import { UserModels } from '../../../../shared/models/user.models';
import { MessageService } from '../../../../shared/services/message.service';
import { NavService } from '../../../../shared/services/nav.service';
import { DiscussionBlockComponent } from '../../../../shared/components/discussion-block/discussion-block.component';

@Component({
  selector: 'app-discuss-list-element',
  templateUrl: './discuss-list-element.component.html',
  styleUrls: ['./discuss-list-element.component.scss']
})
export class DiscussListElementComponent implements OnInit, OnDestroy, AfterViewChecked {

  private unsubscribe$ = new Subject();
  discuss: DiscussModel;
  id;
  discussions: DiscussionMessageModel[] = [];
  user: UserModels;
  options = {
    lineNumbers: true,
    readOnly: false,
    mode: 'text/x-java',
  };
  optionsOutput = {
    lineNumbers: true,
    readOnly: true,
    mode: 'text/x-pgsql'
  };
  @ViewChild(DiscussionBlockComponent, {static: false}) discussComponent: DiscussionBlockComponent;
  constructor(private router: Router,
              private discussService: DiscussService,
              private userService: UserService,
              private messageService: MessageService,
              public navService: NavService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.navService.setUpModel({discuss: true, taskId: res.id});
        this.id = res.id;
        this.getDiscussions();
      });
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: DiscussModel) => {
      this.discuss = res;
    });
    this.userService.getModel()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.user = res);
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
    this.messageService.getDiscuss(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.discussions = res);
  }

  updateDiscussion(discussion: DiscussionMessageModel) {
    this.messageService.updateDiscussion(discussion)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.getDiscussions());
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

  addNewResponse(data: DiscussionMessageModel) {
    console.log(data);
    if (!!data.text) {
      this.messageService.addDiscussion(data.taskId, data.text, data.exerciseId, this.discuss.id, data.sqlExerciseId, data.parentId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
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

  goBackToList(id?: number) {
    if (!id) {
      this.router.navigate(['discuss']);
    } else {
      this.router.navigate(['discuss', id]);
    }
  }

  deleteDiscussion(d: any) {
    console.log(d);
    this.messageService.deleteDiscussion(d.id)
      .pipe(switchMap(() =>     this.messageService.getDiscuss(this.id)),
        takeUntil(this.unsubscribe$))
      .subscribe(res => this.discussions = res);
  }

  showDiscussionForm() {
    this.discussComponent.showDiscussionForm();
  }
}
