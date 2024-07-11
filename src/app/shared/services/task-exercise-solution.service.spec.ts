import { TestBed } from '@angular/core/testing';

import { TaskExerciseSolutionService } from './task-exercise-solution.service';

describe('TaskExerciseSolutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskExerciseSolutionService = TestBed.get(TaskExerciseSolutionService);
    expect(service).toBeTruthy();
  });
});
