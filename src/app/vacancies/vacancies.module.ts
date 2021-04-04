import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { VacanciesRoutingModule } from './vacancies.routing.module';
import { VacanciesListComponent } from './components/vacancies-list/vacancies-list.component';
import { VacancyDetailsComponent } from './components/vacancy-details/vacancy-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VacancyViewComponent } from './components/vacancy-view/vacancy-view.component';


@NgModule({
  declarations: [
    VacanciesListComponent,
    VacancyDetailsComponent,
    VacancyViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VacanciesRoutingModule,
    ReactiveFormsModule
  ]
})
export class VacanciesModule { }
