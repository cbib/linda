import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationUnitFormComponent } from './observation-unit-form.component';

describe('ObservationUnitFormComponent', () => {
  let component: ObservationUnitFormComponent;
  let fixture: ComponentFixture<ObservationUnitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationUnitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
