import { TestBed } from '@angular/core/testing';

import { TaskExerciseService } from './task-exercise.service';

describe('TaskExerciseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskExerciseService = TestBed.get(TaskExerciseService);
    expect(service).toBeTruthy();
  });
});
