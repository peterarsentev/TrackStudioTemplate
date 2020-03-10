import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { TaskModel } from '../../../shared/models/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  tasks: TaskModel[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(() => window.history.state)
      ).subscribe(res => {
        this.tasks = res.data
      console.log(res)
    })
  }

}
