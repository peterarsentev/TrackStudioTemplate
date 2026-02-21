import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JavaViewComponent } from './java-view.component';

describe('JavaViewComponent', () => {
  let component: JavaViewComponent;
  let fixture: ComponentFixture<JavaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JavaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JavaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
