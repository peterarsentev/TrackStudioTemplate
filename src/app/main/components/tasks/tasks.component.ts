import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { TaskModel } from '../../../shared/models/task.model';
import { TasksService } from '../../../shared/services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  tasks: TaskModel[];

  constructor(private route: ActivatedRoute,
              private tasksService: TasksService,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap(res => this.tasksService.getTaskByProjectId(res.taskId))
      ).subscribe(res => {
      this.tasks = res.tasks;
      console.log(res)
    })
  }

  openTask(task: TaskModel) {
    if (task.categoryId === '1') {
      this.tasksService.getTaskByProjectId(task.id)
        .subscribe(res => this.tasks = res.tasks);
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
