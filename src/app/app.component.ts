import { Component, OnInit } from '@angular/core';
import { IconService } from './shared/services/IconService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private iconService: IconService) {
  }
  ngOnInit(): void {
    this.iconService.registerIcons();
  }

}
