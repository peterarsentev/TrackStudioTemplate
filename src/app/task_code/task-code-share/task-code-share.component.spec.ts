import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCodeShareComponent } from './task-code-share.component';

describe('TaskCodeShareComponent', () => {
  let component: TaskCodeShareComponent;
  let fixture: ComponentFixture<TaskCodeShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCodeShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCodeShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
