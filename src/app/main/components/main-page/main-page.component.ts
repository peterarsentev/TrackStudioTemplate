import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  tasks: TaskModel[];
  constructor(private tasksService: TasksService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.tasksService.getTasks()
      .subscribe(res => {
        this.tasks = res.tasks;
        console.log(this.tasks)
      })
  }

  openTask(task: TaskModel) {
    if (task.categoryId === '1') {
      this.router.navigate(['tasks'], {
        queryParams: {
          taskId: task.id,
          action: 'tasks'
        }
      });
    } else {
      this.router.navigate(['task'], {
        queryParams: {
          taskId: task.id,
          action: 'task'
        }
      })
    }
  }
}

