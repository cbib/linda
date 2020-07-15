import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyDescriptionComponent } from './ontology-description.component';

describe('OntologyDescriptionComponent', () => {
  let component: OntologyDescriptionComponent;
  let fixture: ComponentFixture<OntologyDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntologyDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntologyDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
