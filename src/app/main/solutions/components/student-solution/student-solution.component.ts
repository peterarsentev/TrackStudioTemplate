import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Links } from '../../../../shared/models/links';
import { NavNode } from '../../../../shared/models/nav.node';
import { NavService } from '../../../../shared/services/nav.service';

@Component({
  selector: 'app-student-solution',
  templateUrl: './student-solution.component.html',
  styleUrls: ['./student-solution.component.scss']
})
export class StudentSolutionComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  links: Links;
  private taskId: string;
  private topicId: string;
  constructor(private router: Router,
              private navService: NavService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe( (res: Links) => {
      this.links = res;
      this.setUpNavs(res.author);
    });

  }

  setUpNavs(author: string) {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.taskId = res.id;
        this.topicId = res.topicId;
        this.navService.setUpModel({...new NavNode(), topicId: +this.topicId, taskId: +this.taskId, exercise: true, authorName: author});
      });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
