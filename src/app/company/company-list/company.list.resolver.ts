import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CompanyModel } from '../companyModel';
import { Observable } from 'rxjs';
import { CompanyService } from '../companyService';

@Injectable({providedIn: 'root'})
export class CompanyListResolver implements Resolve<CompanyModel[]> {

  constructor(private companyService: CompanyService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<CompanyModel[]> | Promise<CompanyModel[]> | CompanyModel[] {
    return this.companyService.getList(0);
  }

}
