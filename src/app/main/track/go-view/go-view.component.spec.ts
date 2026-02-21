import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoViewComponent } from './go-view.component';

describe('GoViewComponent', () => {
  let component: GoViewComponent;
  let fixture: ComponentFixture<GoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
