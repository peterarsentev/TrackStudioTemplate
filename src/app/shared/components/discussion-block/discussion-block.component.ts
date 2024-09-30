import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DiscussionMessageModel } from '../../models/discussionMessageModel';
import { UserModels } from '../../models/user.models';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-discussion-block',
  templateUrl: './discussion-block.component.html',
  styleUrls: ['./discussion-block.component.scss']
})
export class DiscussionBlockComponent implements OnInit, OnDestroy {

  @Input() discussions: DiscussionMessageModel[] = [];
  @Input() user: UserModels;
  @Input() canResponse = true;
  @Input() title = '';
  @Input() company: boolean;
  @Output() closeEmitter: EventEmitter<any> = new EventEmitter<string>();
  @Output() addResponse: EventEmitter<DiscussionMessageModel> = new EventEmitter<DiscussionMessageModel>();
  @Output() deleteEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateEmitter: EventEmitter<any> = new EventEmitter<any>();
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  @Output()showButton: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() needToShow = false;
  showDiscussion = false;
  @Input() inTask = true;
  constructor(private route: ActivatedRoute, private router: Router) { }
  canCreateDiscuss = true;

  ngOnInit() {
    if (this.router.url.includes('discuss') || this.router.url.includes('task_code')) {
      this.inTask = false;
      this.needToShow = true;
    }
    this.router.events
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        if (res instanceof NavigationEnd) {
          if (res.url.includes('discus') || this.router.url.includes('task_code')) {
            this.inTask = false;
            this.needToShow = true;
          } else {
            this.needToShow = false;
            this.inTask = true;
          }
        }
      });
  }

  showDiscussionForm() {
    this.showDiscussion = !this.showDiscussion;
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  }

  closeDiscussionForm(event: any) {
    this.showDiscussion = false;
    this.closeEmitter.emit(event);
  }

  deleteDiscussion(discussion: DiscussionMessageModel) {
    this.deleteEmitter.emit(discussion);
  }

  update(event: any) {
    console.log('update');
    this.updateEmitter.emit(event);
  }

  show() {
    this.needToShow = !this.needToShow;
    this.showButton.emit(true);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  addNewResponse(data: DiscussionMessageModel) {
    this.addResponse.emit(data);
  }

  goTo(discussion: DiscussionMessageModel) {
    if (this.router.url.includes('user')) {
      this.router.navigate(['discuss', discussion.discussId]);
    }
  }
}
