import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentVariablesPageComponent } from './environment-variables-page.component';

describe('EnvironmentVariablesPageComponent', () => {
  let component: EnvironmentVariablesPageComponent;
  let fixture: ComponentFixture<EnvironmentVariablesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentVariablesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentVariablesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
