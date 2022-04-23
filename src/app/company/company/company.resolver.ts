import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CompanyModel } from '../companyModel';
import { Observable } from 'rxjs';
import { CompanyService } from '../companyService';
import { tap } from 'rxjs/operators';
import { NavService } from '../../shared/services/nav.service';

@Injectable({providedIn: 'root'})
export class CompanyResolver implements Resolve<CompanyModel> {
  constructor(private companyService: CompanyService, private navService: NavService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<CompanyModel> | Promise<CompanyModel> | CompanyModel {
    const id = route.params.id;
    return this.companyService.getById(id).pipe(
      tap(v => {
        this.navService.setUpModel({name: v.name, url: '/company/' + v.id, company: true});
      })
    );
  }

}
