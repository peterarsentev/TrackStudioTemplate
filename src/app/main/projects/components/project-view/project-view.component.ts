import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService } from '../../../../shared/services/nav.service';
import { pluck } from 'rxjs/operators';
import { ProjectModel } from '../../project.model';
import { ProjectService } from '../../project.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit, AfterViewInit {
  @ViewChild(CodemirrorComponent, { static: false }) codemirrorComponent: CodemirrorComponent;

  project: ProjectModel = {};

  options = {
    lineNumbers: true,
    readOnly: true,
    mode: 'text/x-log',
    lineWrapping: true
  };

  constructor(private router: Router,
              private navService: NavService,
              private route: ActivatedRoute,
              private projectService: ProjectService) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'))
      .subscribe((res: ProjectModel) => this.project = res);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const editor = this.codemirrorComponent.codeMirror;
      if (editor) {
        const lineCount = editor.lineCount(); // Get the total number of lines

        for (let i = 0; i < lineCount; i++) {
          const lineText = editor.getLine(i); // Get the text of the line

          if (lineText.startsWith('[ERROR]')) { // Check if the line starts with [ERROR]
            editor.addLineClass(i, 'background', 'highlighted-line');
          }
        }
      }
    }, 100);
  }

}
