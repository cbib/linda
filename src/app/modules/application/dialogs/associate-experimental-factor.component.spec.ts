import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateExperimentalFactorComponent } from './associate-experimental-factor.component';

describe('AssociateExperimentalFactorComponent', () => {
  let component: AssociateExperimentalFactorComponent;
  let fixture: ComponentFixture<AssociateExperimentalFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateExperimentalFactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateExperimentalFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
