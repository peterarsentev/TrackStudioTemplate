import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyService } from '../companyService';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyModel } from '../companyModel';
import { pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavNode } from '../../shared/models/nav.node';
import { NavService } from '../../shared/services/nav.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy {

  paginationAllowed = true;
  scrollDistance = 1;
  throttle: 500;
  hasNext: boolean;
  page = 0;
  companies: CompanyModel[] = [];
  private unsubscribe$ = new Subject();

  constructor(private companyService: CompanyService,
              private navService: NavService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.navService.setUpModel({...new NavNode(), company: true });
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.unsubscribe$)
      ).subscribe((res: CompanyModel[]) => {
      window.scrollTo(0, 0);
      this.companies = res;
      this.hasNext = res.length === 20;
      this.paginationAllowed = res.length === 20;
    });
  }

  onScrollDown() {
    this.page++;
    if (this.hasNext) {
      this.getList();
    }
  }

  goTo(company: CompanyModel) {
    this.router.navigate(['company', `${company.id}`]);
  }

  getList() {
    this.companyService.getList(this.page)
      .subscribe(res => {
        this.companies = this.companies.concat(res);
        this.hasNext = res.length === 20;
        this.paginationAllowed = res.length === 20;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
