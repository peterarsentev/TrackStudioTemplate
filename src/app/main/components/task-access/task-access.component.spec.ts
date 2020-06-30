import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAccessComponent } from './task-access.component';

describe('TaskAccessComponent', () => {
  let component: TaskAccessComponent;
  let fixture: ComponentFixture<TaskAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
