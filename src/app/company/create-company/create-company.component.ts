import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../companyService';
import { Router } from '@angular/router';
import { NavService } from '../../shared/services/nav.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {

  constructor(private router: Router, private navService: NavService,
              private companyService: CompanyService) { }

  ngOnInit() {
    this.navService.setUpModel({name: 'Новая', url: '/company/create', company: true});
  }

  save(company: {name: string, description: string}) {
    this.companyService.save(company)
      .subscribe(res => this.router.navigate(['company', `${res.id}`]));
  }
}
