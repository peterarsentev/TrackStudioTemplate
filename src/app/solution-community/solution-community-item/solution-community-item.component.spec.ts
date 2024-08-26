import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionCommunityItemComponent } from './solution-community-item.component';

describe('SolutionCommunityItemComponent', () => {
  let component: SolutionCommunityItemComponent;
  let fixture: ComponentFixture<SolutionCommunityItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionCommunityItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionCommunityItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
