import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Links } from '../../../../shared/models/links';

@Component({
  selector: 'app-student-solution',
  templateUrl: './student-solution.component.html',
  styleUrls: ['./student-solution.component.scss']
})
export class StudentSolutionComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  links: Links;
  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe( (res: Links) => {
      this.links = res;
    });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
