import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Route, Router} from '@angular/router';
import {NavService} from '../../../../shared/services/nav.service';
import {pluck} from 'rxjs/operators';
import {VacancyModels} from '../../../../shared/models/vacancy.models';
import {ProjectModel} from '../../project.model';
import {ProjectService} from '../../project.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  project = new ProjectModel();

  constructor(private router: Router,
              private navService: NavService,
              private route: ActivatedRoute,
              private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.findById(this.router.projectId)
      .subscribe(() => this.project);
  }
}
