import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CompanyModel } from '../companyModel';
import { Observable } from 'rxjs';
import { CompanyService } from '../companyService';

@Injectable({providedIn: 'root'})
export class CompanyResolver implements Resolve<CompanyModel> {
  constructor(private companyService: CompanyService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<CompanyModel> | Promise<CompanyModel> | CompanyModel {
    const id = route.params.id;
    return this.companyService.getById(id);
  }

}
