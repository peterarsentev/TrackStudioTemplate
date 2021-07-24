import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectModel } from '../../project.model';
import { ModalService, TypeModals } from '../../../../shared/modal.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-project-element-list]',
  templateUrl: './project-element-list.component.html',
  styleUrls: ['./project-element-list.component.scss']
})
export class ProjectElementListComponent implements OnInit {

  @Input() project: ProjectModel;
  @Output() updateEmit: EventEmitter<ProjectModel> = new EventEmitter();
  @Output() deleteEmit: EventEmitter<number> = new EventEmitter();
  editLine: boolean;
  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  edit() {
    this.editLine = true;
  }

  update() {
    this.editLine = false;
    this.updateEmit.emit(this.project);
  }

  showMore() {
    this.modalService.openDialog(TypeModals.SHOW_LOG, this.project.log);
  }

  delete() {
    this.deleteEmit.emit(this.project.id);
  }
}
