import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamResultComponent } from './exam.result.component';

describe('Exam.ResultComponent', () => {
  let component: Exam.ResultComponent;
  let fixture: ComponentFixture<Exam.ResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Exam.ResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Exam.ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
