import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationUnitComponent } from './observation-unit.component';

describe('ObservationUnitComponent', () => {
  let component: ObservationUnitComponent;
  let fixture: ComponentFixture<ObservationUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
