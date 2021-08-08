import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartService } from './chart.service';
import * as moment from 'moment';
import { ChartComponent } from 'angular2-chartjs';
import { UserActivityModel } from '../../../shared/models/user.activity.model';


@Component({
  selector: 'app-chart',
  templateUrl: './chart-user.component.html',
  styleUrls: ['./chart-user.component.scss']
})
export class ChartUserComponent implements OnInit {

  @Input() set activity(userActivityModels: UserActivityModel[]) {
    this.data.labels = [];
    if (userActivityModels) {
    userActivityModels.forEach(ua => {
      this.data.labels.push(moment(ua.date).format('DD.MM.yyyy'));
      this.data.datasets[0].data.push(ua.total);
    });
    this.chart.chart.update();
    }
  }
  @ViewChild(ChartComponent, {static: false}) chart: ChartComponent;

  type = 'line';
  data = {
    labels: [],
    datasets: [
      {
        label: 'Активность ',
        data: []
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };
  constructor(private chartService: ChartService) { }

  ngOnInit() {
  }

}
