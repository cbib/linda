import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicalMaterialDialogComponent } from './biological-material-dialog.component';

describe('BiologicalMaterialDialogComponent', () => {
  let component: BiologicalMaterialDialogComponent;
  let fixture: ComponentFixture<BiologicalMaterialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiologicalMaterialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiologicalMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
