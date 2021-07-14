import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, takeUntil } from 'rxjs/operators';
import { DiscussModel } from '../../../../shared/models/discuss.model';
import { Subject } from 'rxjs';
import { DiscussService } from '../../discuss.service';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'app-discuss-list',
  templateUrl: './discuss-list.component.html',
  styleUrls: ['./discuss-list.component.scss']
})
export class DiscussListComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  discussList: DiscussModel[];
  paginationAllowed = true;
  scrollDistance = 5;
  throttle: 100;
  hasNext: boolean;
  page = 0;
  showOnlySub;
  constructor(private router: Router,
              private discussService: DiscussService,
              private messageService: MessageService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'),
      takeUntil(this.unsubscribe$)
    ).subscribe((res: DiscussModel[]) => {
      this.discussList = res;
      this.hasNext = this.discussList.length === 20;
      this.paginationAllowed = this.discussList.length === 20;
    });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onScrollDown() {
    this.page++;
    if (this.hasNext) {
      this.getDiscuss();
    }
  }

  getDiscuss(my?: boolean) {
    this.discussService.findAll(this.page, my)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.discussList = this.discussList.concat(res);
        this.hasNext = res.length === 20;
        this.paginationAllowed = res.length === 20;
      });
  }

  goTo(discuss: DiscussModel) {
    this.router.navigate([`${discuss.id}`], { relativeTo: this.route });
  }

  subscribe(discuss: DiscussModel, index) {
    this.messageService.makeSubscribeOrRevert(discuss.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.discussList[index].subscribed = res.subscribe);
  }

  addFilter() {
    this.showOnlySub = !this.showOnlySub;
    this.page = 0;
    this.discussList = [];
    this.getDiscuss(this.showOnlySub);
  }
}
