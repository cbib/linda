import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleSelectionComponent } from './sample-selection.component';

describe('SampleSelectionComponent', () => {
  let component: SampleSelectionComponent;
  let fixture: ComponentFixture<SampleSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
