import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateObservationUnitComponent } from './associate-observation-unit.component';

describe('AssociateObservationUnitComponent', () => {
  let component: AssociateObservationUnitComponent;
  let fixture: ComponentFixture<AssociateObservationUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateObservationUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateObservationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
