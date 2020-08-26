import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicalMaterialSelectionDialogComponent } from './biological-material-selection-dialog.component';

describe('BiologicalMaterialSelectionDialogComponent', () => {
  let component: BiologicalMaterialSelectionDialogComponent;
  let fixture: ComponentFixture<BiologicalMaterialSelectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiologicalMaterialSelectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiologicalMaterialSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
