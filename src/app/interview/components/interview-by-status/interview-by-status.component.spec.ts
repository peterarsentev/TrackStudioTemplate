import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewByStatusComponent } from './interview-by-status.component';

describe('InterviewByStatusComponent', () => {
  let component: InterviewByStatusComponent;
  let fixture: ComponentFixture<InterviewByStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewByStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
