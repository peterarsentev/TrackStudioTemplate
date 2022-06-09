import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamIntroComponent } from './exam.intro.component';

describe('Exam.IntroComponent', () => {
  let component: Exam.IntroComponent;
  let fixture: ComponentFixture<Exam.IntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Exam.IntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Exam.IntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
