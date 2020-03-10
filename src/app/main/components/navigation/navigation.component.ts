import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskModel } from '../../../shared/models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  tasks: TaskModel[];
  constructor(private tasksService: TasksService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.tasksService.getTasks()
      .subscribe(res => {
        this.tasks = res.tasks;
        console.log(this.tasks)
      })
  }

  loadSubTask(task: TaskModel) {
    console.log(task)
  }

  goToTasks() {
    this.router.navigate(['/tasks'], {
      state: {
        data: this.tasks
      },
      queryParams: {
        id: localStorage.getItem('defaultProjectId')
      }
    });
  }

  openTask(task: TaskModel) {
    if (task.categoryId === '1') {
      this.tasksService.getTaskByProjectId(task.id)
        .subscribe(res => this.tasks = res.tasks);
    } else {
      this.router.navigate(['task'], {
        queryParams: {
          taskId: task.id
        }
      })
    }
  }
}
