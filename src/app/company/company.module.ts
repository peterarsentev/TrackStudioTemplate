import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CompanyRoutingModule } from './company-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyListComponent } from './company-list/company-list.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { CompanyComponent } from './company/company.component';

@NgModule({
  declarations: [
    CompanyListComponent,
    CreateCompanyComponent,
    CompanyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    CompanyRoutingModule,
    ReactiveFormsModule
  ]
})

export class CompanyModule {
}
