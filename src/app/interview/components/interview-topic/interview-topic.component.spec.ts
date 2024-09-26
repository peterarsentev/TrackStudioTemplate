import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewTopicComponent } from './interview-topic.component';

describe('InterviewTopicComponent', () => {
  let component: InterviewTopicComponent;
  let fixture: ComponentFixture<InterviewTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
