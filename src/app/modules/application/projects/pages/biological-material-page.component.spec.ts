import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicalMaterialPageComponent } from './biological-material-page.component';

describe('BiologicalMaterialPageComponent', () => {
  let component: BiologicalMaterialPageComponent;
  let fixture: ComponentFixture<BiologicalMaterialPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiologicalMaterialPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiologicalMaterialPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
