import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewTopicsComponent } from './interview-topics.component';

describe('InterviewTopicsComponent', () => {
  let component: InterviewTopicsComponent;
  let fixture: ComponentFixture<InterviewTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
