import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamQuestionComponent } from './exam.question.component';

describe('Exam.QuestionComponent', () => {
  let component: Exam.QuestionComponent;
  let fixture: ComponentFixture<Exam.QuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Exam.QuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Exam.QuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
