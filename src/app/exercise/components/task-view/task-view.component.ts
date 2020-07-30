import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { TaskTopicModel } from '../../../shared/models/task.topic.model';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  task: TaskTopicModel = {};
  constructor(private taskService: TasksService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(res =>  this.getTaskById(res.id))
  }

  getTaskById(id: string) {
    this.taskService.getTaskById(id)
      .subscribe(res => this.task = res);
  }
}

