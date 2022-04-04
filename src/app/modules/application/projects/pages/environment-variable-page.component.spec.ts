import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentVariablePageComponent } from './environment-variable-page.component';

describe('EnvironmentVariablePageComponent', () => {
  let component: EnvironmentVariablePageComponent;
  let fixture: ComponentFixture<EnvironmentVariablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentVariablePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentVariablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
