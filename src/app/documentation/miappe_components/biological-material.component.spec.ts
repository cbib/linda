import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicalMaterialComponent } from './biological-material.component';

describe('BiologicalMaterialComponent', () => {
  let component: BiologicalMaterialComponent;
  let fixture: ComponentFixture<BiologicalMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiologicalMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiologicalMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
