import { Component, OnInit } from '@angular/core';
import { IconService } from './shared/services/IconService';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private iconService: IconService, private authService: AuthService) {
  }
  ngOnInit(): void {
    this.iconService.registerIcons();
    this.authService.getDefaultProjectId().subscribe(() => {})
  }

}
