import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionCommunityListComponent } from './solution-community-list.component';

describe('SolutionCommunityListComponent', () => {
  let component: SolutionCommunityListComponent;
  let fixture: ComponentFixture<SolutionCommunityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionCommunityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionCommunityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
