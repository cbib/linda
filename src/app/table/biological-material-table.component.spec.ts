import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicalMaterialTableComponent } from './biological-material-table.component';

describe('BiologicalMaterialTableComponent', () => {
  let component: BiologicalMaterialTableComponent;
  let fixture: ComponentFixture<BiologicalMaterialTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiologicalMaterialTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiologicalMaterialTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
