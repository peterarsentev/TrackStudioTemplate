import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  tasks: TaskTopicModel[] = [];
  constructor(private tasksService: TasksService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'))
      .subscribe(res => this.tasks = res);
  }

  showTask(id: number) {
    this.router.navigate(['exercise', 'task-view', `${id}`]);
  }
}
