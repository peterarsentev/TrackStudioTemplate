import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskCodeService} from '../../../shared/services/task-code.service';
import {TaskExerciseModel} from '../../../shared/models/task.exercise.model';
import {TaskExerciseService} from '../../../shared/services/task-exercise.service';
import {TaskExerciseSolutionModel} from '../../../shared/models/task.exercise.solution.model';
import {TaskExerciseSolutionService} from '../../../shared/services/task-exercise-solution.service';
import {TasksService} from '../../../shared/services/tasks.service';

@Component({
  selector: 'app-task-exercise',
  templateUrl: './task-exercise.component.html',
  styleUrls: ['./task-exercise.component.scss']
})
export class TaskExerciseComponent implements OnInit {
  @Input() taskId: number;
  taskExercise: TaskExerciseModel;
  taskExerciseSolution: TaskExerciseSolutionModel;
  @Output() updateCode = new EventEmitter<string>();

  options = {
    lineNumbers: true,
    readOnly: false,
    mode: 'text/x-java',
    autocorrect: true,
  };

  constructor(
    private tasksService: TasksService,
    private taskExerciseService: TaskExerciseService,
    private taskExerciseSolutionService: TaskExerciseSolutionService,
    private route: ActivatedRoute,
    private router: Router,
    private taskCodeService: TaskCodeService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.taskId && changes.taskId.currentValue) {
      this.taskId = Number(changes.taskId.currentValue);
      this.taskExerciseSolution = undefined;
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.taskExerciseService
      .getByTaskId(this.taskId)
      .subscribe(rs => {
        this.taskExercise = rs;
      });
    this.taskExerciseSolutionService
      .getByTaskId(this.taskId)
      .subscribe(rs => {
        this.updateCode.emit(rs.code);
        this.taskExerciseSolution = rs;
      });
  }

  runCode() {
    this.taskExerciseSolutionService
      .runJava(this.taskExerciseSolution, this.taskId)
      .subscribe(rs => this.taskExerciseSolution = rs);
  }

  onCodeChange(code: string) {
    if (this.taskExerciseSolution) {
      this.taskExerciseSolution.code = code;
      this.updateCode.emit(code);
    }
  }
}
