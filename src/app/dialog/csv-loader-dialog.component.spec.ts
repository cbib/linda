import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvLoaderDialogComponent } from './csv-loader-dialog.component';

describe('CsvLoaderDialogComponent', () => {
  let component: CsvLoaderDialogComponent;
  let fixture: ComponentFixture<CsvLoaderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvLoaderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvLoaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
