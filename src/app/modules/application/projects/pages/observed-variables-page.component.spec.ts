import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservedVariablesPageComponent } from './observed-variables-page.component';

describe('ObservedVariablesPageComponent', () => {
  let component: ObservedVariablesPageComponent;
  let fixture: ComponentFixture<ObservedVariablesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservedVariablesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservedVariablesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
