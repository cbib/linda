import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicalMaterialMiappeComponent } from './biological-material-miappe.component';

describe('BiologicalMaterialComponent', () => {
  let component: BiologicalMaterialMiappeComponent;
  let fixture: ComponentFixture<BiologicalMaterialMiappeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiologicalMaterialMiappeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiologicalMaterialMiappeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
