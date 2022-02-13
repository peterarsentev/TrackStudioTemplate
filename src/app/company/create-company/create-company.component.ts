import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../companyService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {

  constructor(private router: Router, private companyService: CompanyService) { }

  ngOnInit() {
  }

  save(company: {name: string, description: string}) {
    this.companyService.save(company)
      .subscribe(res => console.log(res))
  }
}
