import {Component, OnDestroy, OnInit} from '@angular/core';
import { SqlSolutionService, SqlTopicService } from '../../../shared/services/sql-solution.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SqlExercise, SqlTopic } from '../../../shared/models/sql-exercise.model';
import {PrevNextService} from '../../service/prev-next.service';
import { NavService } from 'src/app/shared/services/nav.service';
import { NavNode } from 'src/app/shared/models/nav.node';

@Component({
  selector: 'app-sql-exercise-list',
  templateUrl: './sql-exercise-list.component.html'
})
export class SqlExerciseListComponent implements OnInit, OnDestroy {

  topic: SqlTopic = new SqlTopic(-1, '', -1);
  exercises: SqlExercise[] = [];

  constructor(private sqlExerciseService: SqlSolutionService,
              private sqlTopicService: SqlTopicService,
              private prevNextService: PrevNextService,
              private navService: NavService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.sqlTopicService.getById(+params.topicId).subscribe((result) => {
        this.topic = result;
        this.sqlExerciseService.all(this.topic.id).subscribe((exercises) => {
          this.exercises = exercises;
          this.prevNextService.setUpData(this.exercises);
          this.navService.setUpModel({...new NavNode(), topicId: this.topic.id, sqlExercise: true});
        });
      });
    });
  }

  goToExercise(id: number) {
    this.router.navigate(['sqlExercise', this.topic.id, 'show', id]);
  }

  ngOnDestroy(): void {
    // this.prevNextService.setUpData([]);
  }
}
