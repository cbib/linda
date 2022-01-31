import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservedVariableComponent } from './observed-variable.component';

describe('ObservedVariableComponent', () => {
  let component: ObservedVariableComponent;
  let fixture: ComponentFixture<ObservedVariableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservedVariableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservedVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
