import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar-view',
  templateUrl: './progress-bar-view.component.html',
  styleUrls: ['./progress-bar-view.component.scss']
})
export class ProgressBarViewComponent implements OnInit {

  @Input() solvedTasksCount: number;
  @Input() allTasksCount = 1;
  @Input() barValue: number;

  constructor() { }

  ngOnInit() {
  }

}
