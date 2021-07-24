import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ProjectModel } from '../../project.model';
import { Observable } from 'rxjs';
import { ProjectService } from '../../project.service';

@Injectable({providedIn: 'root'})
export class ProjectResolver implements Resolve<ProjectModel[]> {
  constructor(private projectService: ProjectService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<ProjectModel[]> | Promise<ProjectModel[]> | ProjectModel[] {
    return this.projectService.getAll();
  }

}
