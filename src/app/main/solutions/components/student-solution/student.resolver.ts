import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Links } from '../../../../shared/models/links';
import { Observable } from 'rxjs';
import { SolutionsService } from '../../solutions.service';

@Injectable({providedIn: 'root'})
export class StudentResolver implements Resolve<Links> {
  constructor(private solutionService: SolutionsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Links> | Promise<Links> | Links {
    const solutionId = route.params.solutionId;
    return this.solutionService.getSolutionsLinks(solutionId);
  }

}
