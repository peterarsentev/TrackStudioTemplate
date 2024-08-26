import {Component, OnDestroy, OnInit} from '@angular/core';
import {SolutionCommunityModel} from '../../shared/models/solution.community.model';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {pluck, takeUntil} from 'rxjs/operators';
import {SolutionCommunityService} from '../../shared/services/solution.community.service';
import {NavNode} from '../../shared/models/nav.node';
import {NavService} from '../../shared/services/nav.service';
import {DiscussModel} from '../../shared/models/discuss.model';

@Component({
  selector: 'app-solution-community-list',
  templateUrl: './solution-community-list.component.html',
  styleUrls: ['./solution-community-list.component.scss']
})
export class SolutionCommunityListComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  solutionCommunities: SolutionCommunityModel[];
  paginationAllowed = true;
  scrollDistance = 5;
  throttle: 100;
  hasNext: boolean;
  page = 0;

  constructor(private router: Router,
              private solutionCommunityService: SolutionCommunityService,
              private navService: NavService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.navService.setUpModel({...new NavNode(), discuss: true });
    this.solutionCommunityService.findAll(this.page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.solutionCommunities = res;
        this.hasNext = res.length === 20;
        this.paginationAllowed = res.length === 20;
      });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onScrollDown() {
    this.page++;
    if (this.hasNext) {
      this.loadSolutionCommunities();
    }
  }

  openSolutionCommunity(solutionCommunityId: number) {
    this.router.navigate(['/solution_community', 'item', solutionCommunityId]);
  }

  loadSolutionCommunities() {
    this.solutionCommunityService.findAll(this.page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.solutionCommunities = this.solutionCommunities.concat(res);
        this.hasNext = res.length === 20;
        this.paginationAllowed = res.length === 20;
      });
  }
}
