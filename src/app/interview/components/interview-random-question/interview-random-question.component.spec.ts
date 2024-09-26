import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewRandomQuestionComponent } from './interview-random-question.component';

describe('InterviewRandomQuestionComponent', () => {
  let component: InterviewRandomQuestionComponent;
  let fixture: ComponentFixture<InterviewRandomQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewRandomQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewRandomQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
