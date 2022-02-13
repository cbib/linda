import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationUnitPageComponent } from './observation-unit-page.component';

describe('ObservationUnitPageComponent', () => {
  let component: ObservationUnitPageComponent;
  let fixture: ComponentFixture<ObservationUnitPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationUnitPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationUnitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
