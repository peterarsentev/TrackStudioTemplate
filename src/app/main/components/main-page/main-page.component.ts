import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Router } from '@angular/router';
import { ResponseModel } from '../../../shared/models/response.model';
import { MStatusesModel } from '../../../shared/models/m.statuses.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  mstatuses: MStatusesModel[] = [];
  tasks: ResponseModel[];
  constructor(private tasksService: TasksService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.tasksService.getTasks()
      .subscribe(res => {
        this.tasks = res.tasks;
        console.log(this.tasks)
      })
    this.geButtons(localStorage.getItem('defaultProjectId'))
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

  geButtons(taskId: string) {
    console.log(taskId)
    this.tasksService.getButtons(taskId)
      .subscribe(res => this.mstatuses = res.mstatuses)
  }

  goToNewTask(status: MStatusesModel) {
    this.router.navigate(['/new-task'])
  }
}

