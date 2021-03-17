import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialForm3Component } from './material-form3.component';

describe('MaterialForm3Component', () => {
  let component: MaterialForm3Component;
  let fixture: ComponentFixture<MaterialForm3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialForm3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialForm3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
