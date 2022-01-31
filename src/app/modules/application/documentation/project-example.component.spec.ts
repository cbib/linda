import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExampleComponent } from './project-example.component';

describe('ProjectExampleComponent', () => {
  let component: ProjectExampleComponent;
  let fixture: ComponentFixture<ProjectExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
