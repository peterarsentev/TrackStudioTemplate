import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService } from '../../../../shared/services/nav.service';
import { pluck } from 'rxjs/operators';
import { ProjectModel } from '../../project.model';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  project = {};

  constructor(private router: Router,
              private navService: NavService,
              private route: ActivatedRoute,
              private projectService: ProjectService) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'))
      .subscribe((res: ProjectModel) => this.project = res);
  }
}
