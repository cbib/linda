import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvLoaderComponent } from './csv-loader.component';

describe('CsvLoaderDialogComponent', () => {
  let component: CsvLoaderComponent;
  let fixture: ComponentFixture<CsvLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
