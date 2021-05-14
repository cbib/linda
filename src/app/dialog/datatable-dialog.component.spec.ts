import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableDialogComponent } from './datatable-dialog.component';

describe('DatatableDialogComponent', () => {
  let component: DatatableDialogComponent;
  let fixture: ComponentFixture<DatatableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
