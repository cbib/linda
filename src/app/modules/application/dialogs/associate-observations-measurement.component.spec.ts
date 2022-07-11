import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateObservationsMeasurementComponent } from './associate-observations-measurement.component';

describe('AssociateObservationsMeasurementComponent', () => {
  let component: AssociateObservationsMeasurementComponent;
  let fixture: ComponentFixture<AssociateObservationsMeasurementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateObservationsMeasurementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateObservationsMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
