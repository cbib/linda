import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentalDesignComponent } from './experimental-design.component';

describe('ExperimentalDesignComponent', () => {
  let component: ExperimentalDesignComponent;
  let fixture: ComponentFixture<ExperimentalDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentalDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentalDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
