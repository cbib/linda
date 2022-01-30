import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicalMaterialSelectionComponent } from './biological-material-selection-dialog.component';

describe('BiologicalMaterialSelectionComponent', () => {
  let component: BiologicalMaterialSelectionComponent;
  let fixture: ComponentFixture<BiologicalMaterialSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiologicalMaterialSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiologicalMaterialSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
