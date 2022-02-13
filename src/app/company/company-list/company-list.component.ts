import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../companyService';
import { Router } from '@angular/router';
import { CompanyModel } from '../companyModel';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  paginationAllowed = true;
  scrollDistance = 5;
  throttle: 100;
  hasNext: boolean;
  page = 0;
  companies: CompanyModel[] = [];
  constructor(private companyService: CompanyService, private router: Router) { }

  ngOnInit() {
    this.getList();
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
        this.companies = res;
        console.log(res);
        this.hasNext = this.companies.length === 20;
        this.paginationAllowed = this.companies.length === 20;
      });
  }
}
