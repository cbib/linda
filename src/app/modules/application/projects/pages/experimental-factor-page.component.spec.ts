import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentalFactorPageComponent } from './experimental-factor-page.component';

describe('ExperimentalFactorPageComponent', () => {
  let component: ExperimentalFactorPageComponent;
  let fixture: ComponentFixture<ExperimentalFactorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentalFactorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentalFactorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
