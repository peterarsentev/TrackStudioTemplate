import { Component, OnInit } from '@angular/core';
import {SqlSolutionService, SqlTopicService} from '../../../shared/services/sql-solution.service';
import { SqlTopic } from '../../../shared/models/sql-exercise.model';
import { Router } from '@angular/router';
import { NavService } from '../../../shared/services/nav.service';
import { NavNode } from '../../../shared/models/nav.node';

@Component({
  selector: 'app-sql-exercise-topic-list',
  templateUrl: './sql-exercise-topic-list.component.html'
})
export class SqlExerciseTopicListComponent implements OnInit {

  topics: SqlTopic[] = [];
  total = 0;

  constructor(private sqlTopicService: SqlTopicService, private sqlExerciseService: SqlSolutionService,
              private router: Router, private navService: NavService) { }

  ngOnInit() {
    this.sqlTopicService.all().subscribe((result) => {
      this.topics = result;
      this.navService.setUpModel({...new NavNode(), sqlExercise: true});
      this.sqlExerciseService.total().subscribe((count) => this.total = count.total);
    });
  }

  goToTopic(id: number) {
    this.router.navigate(['sqlExercise', id]);
  }

  calculateBarValue(topic: SqlTopic) {
    return Math.round((topic.solved / topic.total) * 100);
  }
}
