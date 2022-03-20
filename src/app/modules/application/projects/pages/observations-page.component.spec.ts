import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationsPageComponent } from './observations-page.component';

describe('ObservationsPageComponent', () => {
  let component: ObservationsPageComponent;
  let fixture: ComponentFixture<ObservationsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
