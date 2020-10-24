import { Component, OnInit } from '@angular/core';
import { TaskCodeService } from '../../shared/services/task-code.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicModels } from '../../shared/models/topic.models';
import { NavService } from '../../shared/services/nav.service';
import { NavNode } from '../../shared/models/nav.node';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  total = 0;
  topic$ = this.taskCodeService.exercises();
  constructor(private taskCodeService: TaskCodeService,
              private route: ActivatedRoute,
              private navService: NavService,
              private router: Router) { }

  ngOnInit() {
    this.navService.setUpModel({...new NavNode(), task_code: true})
    this.taskCodeService.total()
      .subscribe(res => {
        this.total = res.total;
      });
  }

  goToTasks(topic: TopicModels) {
    this.router.navigate([`${topic.id}` ], {relativeTo: this.route})
  }
}
