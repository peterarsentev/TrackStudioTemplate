import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartService } from './chart.service';
import * as moment from 'moment';
import { ChartComponent } from 'angular2-chartjs';


@Component({
  selector: 'app-chart',
  templateUrl: './chart-user.component.html',
  styleUrls: ['./chart-user.component.scss']
})
export class ChartUserComponent implements OnInit {

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
    this.getUserActivity();
  }

  getUserActivity() {
   this.chartService.getUserActivity()
     .subscribe(res => {
       this.data.labels = [];
       res.forEach(ua => {
         this.data.labels.push(moment(ua.date).format('DD.MM.yyyy'));
         this.data.datasets[0].data.push(ua.total);
       });
       this.chart.chart.update();
     });
  }
}
