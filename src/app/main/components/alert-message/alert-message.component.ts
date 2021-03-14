import { Component, OnInit } from '@angular/core';
import { TypeAlertsModel } from '../../../shared/models/type.alerts.model';
import { AlertService } from '../../../shared/services/alertService';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {
  type = TypeAlertsModel;

  message: string;
  inputType: TypeAlertsModel;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getModel()
      .subscribe(({message, type}) => {
      this.message = message;
      this.inputType = type;
      setTimeout(() => {
        this.alertService.setUpMessage(undefined);
      }, 2000)
    });
  }

}
