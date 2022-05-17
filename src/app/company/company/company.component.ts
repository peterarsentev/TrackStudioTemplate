import { Component, OnDestroy, OnInit } from '@angular/core';
import { pluck, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CompanyModel } from '../companyModel';
import { DiscussionMessageModel } from '../../shared/models/discussionMessageModel';
import { UserService } from '../../shared/services/user.service';
import { UserModels } from '../../shared/models/user.models';
import { CompanyService } from '../companyService';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  company: CompanyModel;
  discussions: DiscussionMessageModel[] = [];
  user: UserModels;
  constructor(private route: ActivatedRoute, private userService: UserService, private companyService: CompanyService) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: CompanyModel) => {
      this.company = res;
      this.getComments();
    });
    this.userService.getModel()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.user = res);
  }

  closeDiscussion(text: any) {
    this.companyService.addComment(text, this.company.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        console.log(res);
        this.getComments();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getComments() {
    this.companyService.getComments(this.company.id)
      .subscribe(res => this.discussions = res);
  }

  update(comment: any) {
    console.log(comment);
    this.companyService.update(comment.id, comment.text)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.getComments();
      });
  }

  deleteComment(comment: any) {
    this.companyService.delete(comment.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.getComments();
      });
  }
}