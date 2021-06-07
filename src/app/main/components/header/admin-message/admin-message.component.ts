import { Component, Input, OnInit } from '@angular/core';
import { InfoModels } from '../../../../shared/models/info.models';

@Component({
  selector: 'app-admin-message',
  templateUrl: './admin-message.component.html',
  styleUrls: ['./admin-message.component.scss']
})
export class AdminMessageComponent implements OnInit {
  @Input() message: InfoModels;

  constructor() {
  }

  ngOnInit() {
  }

}
