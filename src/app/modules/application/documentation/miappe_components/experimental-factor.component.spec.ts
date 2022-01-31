import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentalFactorComponent } from './experimental-factor.component';

describe('ExperimentalFactorComponent', () => {
  let component: ExperimentalFactorComponent;
  let fixture: ComponentFixture<ExperimentalFactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentalFactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentalFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
