import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationUnitTableComponent } from './observation-unit-table.component';

describe('ObservationUnitTableComponent', () => {
  let component: ObservationUnitTableComponent;
  let fixture: ComponentFixture<ObservationUnitTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationUnitTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationUnitTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
