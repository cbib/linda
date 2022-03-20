import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentalFactorsPageComponent } from './experimental-factors-page.component';

describe('ExperimentalFactorsPageComponent', () => {
  let component: ExperimentalFactorsPageComponent;
  let fixture: ComponentFixture<ExperimentalFactorsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentalFactorsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentalFactorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
