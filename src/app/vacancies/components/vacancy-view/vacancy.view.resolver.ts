import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { VacancyModels } from '../../../shared/models/vacancy.models';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NavService } from '../../../shared/services/nav.service';
import { VacancyService } from '../../vacancy.service';
import { tap } from 'rxjs/operators';
import { NavNode } from '../../../shared/models/nav.node';

@Injectable({providedIn: 'root'})
export class VacancyViewResolver implements Resolve<VacancyModels> {
  constructor(private vacancyService: VacancyService, private navService: NavService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<VacancyModels> | Promise<VacancyModels> | VacancyModels {
    const id = route.params.id;
    return this.vacancyService.getById(id)
      .pipe(
        tap(v => {
          this.navService.setUpModel({name: v.name, url: '/vacancies/view/' + v.id, vacancy: true});
        })
      );
  }

}
