import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskExerciseComponent } from './task-exercise.component';

describe('TaskExerciseComponent', () => {
  let component: TaskExerciseComponent;
  let fixture: ComponentFixture<TaskExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
