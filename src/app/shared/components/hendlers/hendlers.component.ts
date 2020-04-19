import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserModels } from '../../models/user.models';

@Component({
  selector: 'app-hendlers',
  templateUrl: './hendlers.component.html',
  styleUrls: ['./hendlers.component.scss']
})
export class HendlersComponent implements OnInit {

  @Input()handlers: UserModels[];
  @Output()selected: EventEmitter<UserModels> = new EventEmitter<UserModels>();

  constructor() { }

  ngOnInit() {
  }

  select(handler: UserModels) {
    this.selected.emit(handler);
  }
}
