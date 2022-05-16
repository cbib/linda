import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotOverviewComponent } from './plot-overview.component';

describe('PlotOverviewComponent', () => {
  let component: PlotOverviewComponent;
  let fixture: ComponentFixture<PlotOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
