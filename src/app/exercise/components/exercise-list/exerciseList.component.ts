import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavNode } from '../../../shared/models/nav.node';
import { NavService } from '../../../shared/services/nav.service';

@Component({
  selector: 'app-exercise.list',
  templateUrl: './exerciseList.component.html',
  styleUrls: ['./exerciseList.component.scss']
})
export class ExerciseListComponent implements OnInit {

  tasks$ = this.taskService.getTasksTopicsList();
  constructor(private taskService: TasksService,
              private router: Router,
              private navService: NavService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.navService.setUpModel({...new NavNode(), exercise: true});
  }

  showTask(id: any) {
    this.router.navigate([`${id}`], { relativeTo: this.route });
  }
}
