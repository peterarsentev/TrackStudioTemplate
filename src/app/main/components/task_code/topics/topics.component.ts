import { Component, OnInit } from '@angular/core';
import { TaskCodeService } from '../../../../shared/services/task-code.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  topic$ = this.taskCodeService.getAllTopics();
  constructor(private taskCodeService: TaskCodeService,
              private router: Router) { }

  ngOnInit() {
  }

  goToTasks(id: string) {
    this.router.navigate(['tasks_code_list', `${id}`])
  }
}
