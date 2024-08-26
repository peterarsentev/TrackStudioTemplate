import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionCommunityPublishComponent } from './solution-community-publish.component';

describe('SolutionCommunityPublishComponent', () => {
  let component: SolutionCommunityPublishComponent;
  let fixture: ComponentFixture<SolutionCommunityPublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionCommunityPublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionCommunityPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
