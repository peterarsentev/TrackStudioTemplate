import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { CompanyComponent } from './company/company.component';
import { CompanyResolver } from './company/company.resolver';
import { CompanyListResolver } from './company-list/company.list.resolver';

const routes: Routes = [
  { path: '', component: CompanyListComponent, resolve: {data: CompanyListResolver } },
  { path: 'create', component: CreateCompanyComponent },
  { path:  ':id' , component: CompanyComponent , resolve: { data: CompanyResolver }}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {
}
