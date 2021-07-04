import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DiscussModel } from '../../../../shared/models/discuss.model';
import { Observable } from 'rxjs';
import { DiscussService } from '../../discuss.service';

@Injectable({providedIn: 'root'})
export class DiscussElementResolver implements Resolve<DiscussModel> {
  constructor(private discussService: DiscussService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<DiscussModel> | Promise<DiscussModel> | DiscussModel {
    const id = route.params.id;
    return this.discussService.getById(id);
  }

}
