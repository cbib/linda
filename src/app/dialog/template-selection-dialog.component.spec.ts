import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSelectionDialogComponent } from './template-selection-dialog.component';

describe('TemplateSelectionDialogComponent', () => {
  let component: TemplateSelectionDialogComponent;
  let fixture: ComponentFixture<TemplateSelectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateSelectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
