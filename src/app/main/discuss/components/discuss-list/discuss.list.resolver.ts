import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DiscussModel } from '../../../../shared/models/discuss.model';
import { Observable } from 'rxjs';
import { DiscussService } from '../../discuss.service';
import { NavNode } from '../../../../shared/models/nav.node';
import { NavService } from '../../../../shared/services/nav.service';

@Injectable({providedIn: 'root'})
export class DiscussListResolver implements Resolve<DiscussModel[]> {
  constructor(private discussService: DiscussService, private navService: NavService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<DiscussModel[]> | Promise<DiscussModel[]> | DiscussModel[] {
    this.navService.setUpModel({...new NavNode(), discuss: true });
    return this.discussService.findAll(0);
  }
}
