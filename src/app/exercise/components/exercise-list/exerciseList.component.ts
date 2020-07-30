import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exercise.list',
  templateUrl: './exerciseList.component.html',
  styleUrls: ['./exerciseList.component.scss']
})
export class ExerciseListComponent implements OnInit {

  tasks$ = this.taskService.getTasksTopicsList();
  constructor(private taskService: TasksService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  showTask(id: any) {
    this.router.navigate([`${id}`], { relativeTo: this.route });
  }
}
