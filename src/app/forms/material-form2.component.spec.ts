import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialForm2Component } from './material-form2.component';

describe('MaterialForm2Component', () => {
  let component: MaterialForm2Component;
  let fixture: ComponentFixture<MaterialForm2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialForm2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
