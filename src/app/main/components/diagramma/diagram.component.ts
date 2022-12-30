import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { DiagramaModel } from '../../../shared/models/diagrama.model';

@Component({
  selector: 'app-diagramma',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {


  @Input() diagram: DiagramaModel = {};

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = ['Выполнено', 'Всего задач'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    annotation: undefined,
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: [
        'rgb(13,107,212)',
        'rgba(234,45,12,0.73)']
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'horizontalBar';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit() {
    this.lineChartData = [
      { data: [this.diagram.solved, this.diagram.total], label: this.diagram.label },
    ];
  }

}
