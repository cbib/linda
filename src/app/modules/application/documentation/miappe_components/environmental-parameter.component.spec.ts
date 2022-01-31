import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentalParameterComponent } from './environmental-parameter.component';

describe('EnvironmentalParameterComponent', () => {
  let component: EnvironmentalParameterComponent;
  let fixture: ComponentFixture<EnvironmentalParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentalParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentalParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
