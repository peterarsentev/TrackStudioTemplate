import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { ProjectModel } from '../../project.model';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  newLine: boolean;
  projects: ProjectModel[];
  name: string;
  link: string;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'))
      .subscribe((res: ProjectModel[]) => this.projects = res);
  }

  addNewProject() {
    this.newLine = true;
  }

  save() {
    this.link = this.link.trim();
    this.name = this.name.trim();
    if (this.link && this.name) {
      this.newLine = false;
      this.projectService.addProject(this.name, this.link)
        .subscribe(res => {
          this.projects.push(res);
          this.link = undefined;
          this.name = undefined;
        });
    }
  }

  update(project: ProjectModel, idx: number) {
    this.projectService.update(project)
      .subscribe(res => this.projects[idx] = res);
  }

  cancel() {
    this.newLine = false;
    this.link = undefined;
    this.name = undefined;
  }

  delete(id: number, idx: number) {
    this.projectService.delete(id)
      .subscribe(() => this.projects.splice(idx, 1));
  }
}
