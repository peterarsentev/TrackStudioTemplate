import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { LognModel } from '../../../shared/models/logn.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.defaultLogin();
  }

  defaultLogin() {
    const defUser: LognModel = {action: 'login', login: 'anonymous', password: '123'};
    this.authService.login(defUser)
      .subscribe(res => console.log(res));
  }
}
