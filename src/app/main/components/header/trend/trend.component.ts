import { Component, OnInit } from '@angular/core';
import {TrendService} from '../../../../shared/services/trend.service';
import {TrendModel} from '../../../../shared/models/trend.model';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.scss']
})
export class TrendComponent implements OnInit {

  trends: TrendModel[];

  constructor(private trendService: TrendService) { }

  ngOnInit() {
    this.trendService.findAll()
      .subscribe(rs => this.trends = rs);
  }
}
