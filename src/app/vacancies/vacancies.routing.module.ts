import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacanciesListComponent } from './components/vacancies-list/vacancies-list.component';
import { VacancyDetailsComponent } from './components/vacancy-details/vacancy-details.component';
import { VacancyViewComponent } from './components/vacancy-view/vacancy-view.component';
import { VacancyViewResolver } from './components/vacancy-view/vacancy.view.resolver';

const routes: Routes = [
  { path: '', component: VacanciesListComponent },
  { path: 'detail/:id', component: VacancyDetailsComponent },
  { path: 'view/:id', component: VacancyViewComponent, resolve: {data: VacancyViewResolver} }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacanciesRoutingModule {

}
