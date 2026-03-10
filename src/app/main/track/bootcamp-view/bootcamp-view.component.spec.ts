import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BootcampViewComponent } from './bootcamp-view.component';

describe('BootcampViewComponent', () => {
  let component: BootcampViewComponent;
  let fixture: ComponentFixture<BootcampViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BootcampViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BootcampViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
