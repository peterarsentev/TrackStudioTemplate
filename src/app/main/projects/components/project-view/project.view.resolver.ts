import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ProjectModel } from '../../project.model';
import { Observable } from 'rxjs';
import { ProjectService } from '../../project.service';

@Injectable({providedIn: 'root'})
export class ProjectViewResolver implements Resolve<ProjectModel> {

  constructor(private projectService: ProjectService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<ProjectModel> | Promise<ProjectModel> | ProjectModel {
    const id = route.params.projectId;
    return this.projectService.findById(id);
  }

}
