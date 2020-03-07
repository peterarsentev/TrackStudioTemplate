import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { LoginModel } from '../../../shared/models/login.model';
import { TasksService } from '../../../shared/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  constructor(private tasksService: TasksService, private authService: AuthService) { }

  ngOnInit() {
    this.defaultLogin();
    this.tasksService.getTasks()
      .subscribe(res => console.log(res))
  }

  defaultLogin() {
    this.authService.login()
      .subscribe(res => {
      }, error => console.error(error));
  }
}
