import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigtechViewComponent } from './bigtech-view.component';

describe('BigtechViewComponent', () => {
  let component: BigtechViewComponent;
  let fixture: ComponentFixture<BigtechViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigtechViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigtechViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
