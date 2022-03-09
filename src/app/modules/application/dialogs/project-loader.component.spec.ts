import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLoaderComponent } from './project-loader.component';

describe('ProjectLoaderComponent', () => {
  let component: ProjectLoaderComponent;
  let fixture: ComponentFixture<ProjectLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
